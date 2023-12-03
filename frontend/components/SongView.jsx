import {Grid, GridItem, Heading, Img, VStack, Text, HStack, Badge, Box} from "@chakra-ui/react";
import {css} from "../style/scroll.js";
import DelimiterWithText from "./DelimiterWithText.jsx";

const Song = () => {
    return (
        <VStack
            spacing={'20px'}
            overflowY={'auto'}
            maxH={'calc(100vh - 250px)'}
            paddingRight={'10px'}
            css={css}
        >
            <Grid
                templateRows={'250px'}
                templateColumns={'250px 1fr'}
                w={'100%'}
                gap={'0 30px'}
            >
                <GridItem>
                    <Img src={'https://picsum.photos/250'} borderRadius={'5px'} h={'250px'}/>
                </GridItem>
                <GridItem>
                    <VStack
                        alignItems={'start'}
                        spacing={'10px'}
                    >
                        <Heading size={'xl'}>Song name</Heading>
                        <Text color={'gray.400'}>Category | Singer</Text>
                        <HStack
                            wrap={'wrap'}
                        >
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                            <Badge>#tag1</Badge>
                        </HStack>
                    </VStack>
                </GridItem>
            </Grid>
            <DelimiterWithText
                w={'100%'}
                color={'white'}
                text={'Text'}
                textBg={'gray.700'}
            />
            <Box
                w={'60%'}
                h={'fit-content'}
                borderRadius={'10px'}
                bg={'gray.800'}
                p={'20px'}
            >
                <Text
                    fontSize={'lg'}
                >
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, modi, quaerat? Asperiores id magnam
                    magni quas unde ut voluptate voluptates! A ad alias dolore ducimus ea excepturi expedita incidunt
                    mollitia nostrum, perferendis perspiciatis quasi quos sapiente, sint sunt vero voluptate
                    voluptatibus. Ad aspernatur exercitationem hic impedit numquam sed ullam? Aliquam amet asperiores,
                    aspernatur aut dolorum eum fuga illo laborum numquam officiis quod, saepe sed similique sit soluta
                    totam veritatis! Ad alias aliquam architecto aspernatur dicta dolore dolores doloribus enim
                    exercitationem facere facilis fuga illum ipsa ipsum itaque iusto laudantium molestiae nihil nostrum
                    officiis placeat praesentium quasi quia quis quisquam, quo ratione rerum sunt tenetur vero! Beatae
                    dolor et laborum non officia quo sequi ullam! Deleniti dicta dolores eaque quod sapiente! Eaque ex
                    excepturi, incidunt libero optio rem voluptatibus voluptatum. A ab aperiam corporis fuga iusto,
                    laudantium pariatur quibusdam quos sit vel! Ad aut earum eius eligendi fuga libero minima nobis quia
                    tempore tenetur. Ad dolor eveniet necessitatibus, numquam placeat quidem. Aspernatur enim eum
                    impedit iste quasi quod tenetur! Aspernatur, at cupiditate dicta dignissimos distinctio doloremque
                    excepturi expedita explicabo fugiat, laboriosam natus numquam pariatur quidem reprehenderit sed unde
                    vitae. Autem blanditiis consequatur cupiditate, est minima qui sequi tempore ut? Ad alias architecto
                    at deleniti distinctio dolor eius, eos et incidunt inventore itaque iusto minima modi molestiae
                    natus nisi nobis non odit optio possimus, praesentium quam quia quibusdam quidem quisquam similique
                    sint soluta sunt, totam vel velit vitae voluptates voluptatum. A asperiores blanditiis delectus
                    dolorem dolores dolorum et expedita magni minus molestiae nam nihil quis quisquam, reiciendis saepe
                    sit tenetur? Asperiores aut laborum mollitia. Consequuntur ipsum nam nesciunt odit praesentium
                    repellat reprehenderit, unde! Harum magni maiores quia quod recusandae sequi tempora veniam? Culpa
                    deleniti, explicabo minima odio sequi ut. Amet asperiores nobis perferendis quibusdam saepe.
                    Cupiditate expedita facere fuga inventore laboriosam libero odio quia saepe, voluptatum. Adipisci
                    aliquid culpa hic iste maiores non odio quam, saepe. Natus porro, vel! Consequuntur culpa cumque
                    deleniti dolor expedita minus natus nostrum, odio quos temporibus? Aliquid aperiam debitis eligendi,
                    ipsa obcaecati odit repellat suscipit. A ab alias aperiam asperiores aspernatur beatae culpa dicta
                    dolor dolorem ea eius ex facere fuga fugit hic impedit ipsum iure iusto libero nesciunt nihil odit
                    quas quis, recusandae repudiandae soluta tempora temporibus tenetur ullam voluptatibus. A
                    accusantium ad aliquam aliquid aspernatur blanditiis cupiditate, dolore illo laborum, laudantium
                    minus optio pariatur recusandae rerum sint sunt, tempora velit! Aperiam autem consequuntur dolor
                    dolorum earum harum pariatur sunt totam. Dolores eligendi eum id illum quod sint veniam? Alias
                    cupiditate est excepturi maxime necessitatibus nesciunt nostrum nulla quia repellat reprehenderit!
                    Ad debitis expedita illum, optio provident quidem recusandae totam voluptate? Amet aspernatur
                    corporis dolor dolorem doloribus fugiat illum incidunt ipsa labore minima, nisi obcaecati
                    perferendis quia, quis, repellendus rerum suscipit unde veritatis vero voluptates. Atque cumque
                    facilis quos vel. Amet atque beatae consequuntur corporis excepturi expedita laudantium nobis,
                    nulla, optio quibusdam, rerum soluta voluptatibus? Blanditiis cupiditate facere facilis neque
                    nostrum numquam porro possimus quisquam, repellendus similique! Assumenda consequuntur nihil qui
                    sapiente ut. Excepturi, minima, quasi.
                </Text>
            </Box>
        </VStack>
    )
}

export default Song