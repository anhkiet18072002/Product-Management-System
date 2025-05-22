import {
   Box,
   BoxProps,
   Dialog as MuiDialog,
   DialogProps as MuiDialogProps,
   styled,
   Typography
} from '@mui/material'
import React from 'react'

const ContainerStyle = styled(Box)<BoxProps>({
   display: 'flex',
   flexDirection: 'column',
   height: '100%',
   minHeight: 360,
   minWidth: 640
})

const MuiDialogStyled = styled(MuiDialog)<DialogProps>({
   '& .MuiPaper-root': {
      width: 1000,
      maxWidth: 'none'
   }
})

type DialogProps = MuiDialogProps & {
   children: React.ReactNode
   open: boolean
   title?: string
}

const Dialog: React.FC<DialogProps> = ({ children, open, onClose, title }) => {
   return (
      <MuiDialogStyled
         open={open}
         onClose={(event, reason) => {
            if (reason && reason === 'backdropClick') {
               return
            }

            onClose?.(event, reason)
         }}
         sx={{
            maxWidth: 'initial'
         }}
      >
         <ContainerStyle>
            <Box
               sx={{
                  borderBottom: '1px solid grey',
                  padding: '20px 20px 10px'
               }}
            >
               <Typography component={'h3'} sx={{ fontWeight: '600' }}>
                  {title || 'This is header'}
               </Typography>
            </Box>
            <Box sx={{ width: '100%', padding: '10px 20px' }}>{children}</Box>
         </ContainerStyle>
      </MuiDialogStyled>
   )
}

export default Dialog
