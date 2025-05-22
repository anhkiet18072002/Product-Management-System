import { PrismaClient } from '@prisma/client';
import { CategorySeed } from './seed/category.seed';
import { subcategorySeed } from './seed/subcategory.seed';
import { UserSeed } from './seed/user.seed';

const prisma = new PrismaClient();

const main = async () => {
  // seed user
  await Promise.all(
    UserSeed.map(({ email, username, password }) =>
      prisma.user.create({ data: { email, username, password } }),
    ),
  );

  // seed category
  const categories = await Promise.all(
    CategorySeed.map(({ name, description }) =>
      prisma.category.create({ data: { name, description } }),
    ),
  );

  const categoryMap = categories.reduce<Record<string, string>>((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {});

  const subcategoryToCategory: Record<string, string> = {
    'Mobile Phones': 'Electronics',
    Laptops: 'Electronics',
    Televisions: 'Electronics',
    Cameras: 'Electronics',

    'Men Clothing': 'Fashion',
    'Women Clothing': 'Fashion',
    Footwear: 'Fashion',
    Accessories: 'Fashion',

    Furniture: 'Home & Kitchen',
    'Kitchen Appliances': 'Home & Kitchen',
    Cookware: 'Home & Kitchen',
    Decor: 'Home & Kitchen',

    Fiction: 'Books',
    'Non-Fiction': 'Books',
    'Children Books': 'Books',
    Educational: 'Books',
  };

  // seed subcategory
  await Promise.all(
    subcategorySeed.map(({ name, description }) => {
      const categoryName = subcategoryToCategory[name];
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        throw new Error(`CategoryId not found for subcategory ${name}`);
      }

      return prisma.subcategory.create({
        data: {
          name,
          description,
          categoryId,
        },
      });
    }),
  );
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
