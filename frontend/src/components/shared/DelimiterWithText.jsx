import {AbsoluteCenter, Box, Divider} from "@chakra-ui/react";

const DelimiterWithText = ({text, textBg, ...props}) => {
    return (
        <Box position='relative' py={'20px'} {...props}>
            <Divider/>
            <AbsoluteCenter px='4' fontSize={'18px'} bg={textBg}>
                {text}
            </AbsoluteCenter>
        </Box>
    )
}

export default DelimiterWithText