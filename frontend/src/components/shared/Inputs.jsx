import {useField} from "formik";
import {Alert, AlertIcon, Box, FormLabel, Input, Select, Text, Textarea} from "@chakra-ui/react";

export const MyInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <Box w={'100%'}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

export const MyTextarea = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <Box w={"100%"}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Textarea className="textarea-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

export const MySelect = ({label, options, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <Box w={"100%"}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Select className="select-input" {...field} {...props}>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </Select>
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

export const FileInput = ({label, setFile, info, ...props}) => {
    const [field, meta, helpers] = useField(props);

    const handleChange = (e) => {
        const file = e.target.files[0];

        helpers.setValue(file)

        if (setFile && file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box w={"100%"}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input
                type="file"
                onChange={handleChange}
                name={field.name}
                accept={props.accept}
            />
            <Text fontSize={'sm'} color={'gray'}>{info}</Text>
            {meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};