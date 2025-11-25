import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import { NewSaint } from "../models/Saint";
import { createSaint } from "../services/SaintService";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import { useAppTheme } from "../hooks/useAppTheme";

type SaintCreateNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "CreateSaint"
>

const CreateSaintScreen = () => {
    const navigation = useNavigation<SaintCreateNavigationProp>();
    const [name, setName] = useState("");
    const [birthYear, setBirthYear] = useState<string>("");
    const [deathYear, setDeathYear] = useState<string>("")
    const [feastDay, setFeastDay] = useState<string | null>("");
    const [patronage, setPatronage] = useState("");
    const [biography, setBiography] = useState("");
    const [canonizationYear, setCanonizationYear] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>("");
    const [imageSource, setImageSource] = useState<string | null>("");
    const [imageAuthor, setImageAuthor] = useState<string | null>("");
    const [imageLicence, setImageLicence] = useState<string | null>("");
    const theme = useAppTheme();
    const Typography = useTypography();

    const handleCreate = async () => {
        if(!name.trim() || !birthYear.trim() || !deathYear.trim() || !feastDay?.trim() || !patronage.trim() || !biography.trim()) {
            Alert.alert("Error, all fields are required");
            return;
        }

        try {
            const parsedBirthYear = parseInt(birthYear);
            const parsedDeathYear = parseInt(deathYear);
            const parsedCanonizationYear = parseInt(canonizationYear);

            const newSaint: NewSaint = {
                name: name.trim(), 
                birthYear: parsedBirthYear, 
                deathYear: parsedDeathYear, 
                feastDay: feastDay?.trim() ?? "", 
                patronage: patronage.trim(),
                biography: biography.trim(), 
                canonizationYear: parsedCanonizationYear,
                imageUrl: imageUrl && imageUrl?.trim() !== "" ? imageUrl.trim() : null
            }

            await createSaint(newSaint);
            Alert.alert("Success, Saint created.");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error, Failed to create Saint!");
        }
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.saint.background}}>
            <View style={[Layout.container, {backgroundColor: theme.saint.background}]}>
                <Text style={[Typography.title, {color: theme.saint.text}]}>Create Saint</Text>
                <TextInput
                    placeholder="Enter name"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={name}
                    onChangeText={(value) => setName(value)}
                />
                <TextInput
                    placeholder="Enter birth year"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    keyboardType="numeric"
                    value={birthYear.toString()}
                    onChangeText={(value) => setBirthYear((value))}
                />
                <TextInput
                    placeholder="Enter death year"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    keyboardType="numeric"
                    value={deathYear.toString()}
                    onChangeText={(value) => setDeathYear((value))}
                />
                <TextInput
                    placeholder="Enter feast day (--MM-dd)"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={feastDay ?? ""}
                    onChangeText={(value) => setFeastDay(value)}
                />
                <TextInput
                    placeholder="Enter biography (min 10 characters)"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={biography}
                    onChangeText={(value) => setBiography(value)}
                />
                <TextInput
                    placeholder="Enter patronage"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={patronage}
                    onChangeText={(value) => setPatronage(value)}
                />
                <TextInput
                    placeholder="Enter canonization year"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    keyboardType="numeric"
                    value={canonizationYear.toString()}
                    onChangeText={(value) => setCanonizationYear((value))}
                />
                <TextInput
                    placeholder="Enter image url"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={imageUrl ?? ""}
                    onChangeText={(value) => setImageUrl(value)}
                />
                <TextInput
                    placeholder="Enter image source"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={imageSource ?? ""}
                    onChangeText={(value) => setImageSource(value)}
                />
                <TextInput
                    placeholder="Enter image author"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={imageAuthor ?? ""}
                    onChangeText={(value) => setImageAuthor(value)}
                />
                <TextInput
                    placeholder="Enter image licence"
                    placeholderTextColor={"black"}
                    style={Layout.input}
                    value={imageLicence ?? ""}
                    onChangeText={(value) => setImageLicence(value)}
                />

                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <TouchableOpacity style={[Layout.button, {backgroundColor: "gray", width: "40%", alignSelf: "center"}]} onPress={() => {navigation.navigate("Saint")}} >
                        <Text style={[Layout.buttonText,{color: theme.saint.text}]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: theme.auth.navbar}]} onPress={handleCreate} >
                        <Text style={[Layout.buttonText, {color: "black"}]}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default CreateSaintScreen;