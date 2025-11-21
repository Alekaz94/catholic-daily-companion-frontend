import { useEffect, useState } from "react";
import { Saint, UpdatedSaint } from "../models/Saint";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Layout } from "../styles/Layout";
import { Typography } from "../styles/Typography";
import { useAppTheme } from '../hooks/useAppTheme';

interface Props {
    visible: boolean;
    saint: Saint | null;
    onClose: () => void;
    onUpdate: (id: string, updatedSaint: UpdatedSaint) => void;
}

const SaintUpdateModal = ({ visible, saint, onClose, onUpdate}: Props) => {
    const [name, setName] = useState("");
    const [birthYear, setBirthYear] = useState<number>(0);
    const [deathYear, setDeathYear] = useState<number>(0)
    const [feastDay, setFeastDay] = useState<string | null>("");
    const [patronage, setPatronage] = useState("");
    const [biography, setBiography] = useState("");
    const [canonizationYear, setCanonizationYear] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState<string | null>("");
    const [imageAuthor, setImageAuthor] = useState<string | null>("");
    const [imageSource, setImageSource] = useState<string | null>("");
    const [imageLicence, setImageLicence] = useState<string | null>("");
    const theme = useAppTheme();

    useEffect(() => {
        if(saint) {
            setName(saint.name);
            setBirthYear(saint.birthYear);
            setDeathYear(saint.deathYear);
            setFeastDay(saint.feastDay);
            setPatronage(saint.patronage);
            setBiography(saint.biography);
            setCanonizationYear(saint.canonizationYear);
            setImageUrl(saint.imageUrl);
            setImageAuthor(saint.imageAuthor);
            setImageSource(saint.imageSource);
            setImageLicence(saint.imageLicence);
        }
    }, [saint]);

    const onHandleSubmit = async () => {
        if(!saint) {
            return;
        };

        const trimmedName = name.trim();
        const trimmedFeastDay = feastDay?.trim();
        const trimmedBiography = biography.trim();
        const trimmedPatronage = patronage.trim();
        const trimmedImageUrl = imageUrl?.trim();
        const trimmedImageAuthor = imageAuthor?.trim();
        const trimmedImageSource = imageSource?.trim();
        const trimmedImageLicence = imageLicence?.trim();
        const updatedBirthYear = birthYear;
        const updatedDeathYear = deathYear;
        const updatedCanonizationYear = canonizationYear;

        if(!trimmedName && !trimmedFeastDay && !trimmedBiography && !trimmedPatronage && !trimmedImageUrl) {
            alert("Name, feastday, biography, patronage and image are empty. No changes saved.");
            return;
        }

        const updatedFields: UpdatedSaint = {};

        if(trimmedName && trimmedName !== saint.name) {
            updatedFields.name = trimmedName;
        }

        if(trimmedBiography && trimmedBiography !== saint.biography) {
            updatedFields.biography = trimmedBiography;
        }
    
        if(trimmedFeastDay && trimmedFeastDay !== saint.feastDay) {
            updatedFields.feastDay = trimmedFeastDay;
        }

        if(trimmedPatronage && trimmedPatronage !== saint.patronage) {
            updatedFields.patronage = trimmedPatronage;
        }

        if(trimmedImageUrl && trimmedImageUrl !== saint.imageUrl) {
            updatedFields.imageUrl = trimmedImageUrl;
        }

        if(trimmedImageAuthor && trimmedImageAuthor !== saint.imageAuthor) {
            updatedFields.imageAuthor = trimmedImageAuthor;
        }

        if(trimmedImageSource && trimmedImageSource !== saint.imageSource) {
            updatedFields.imageSource = trimmedImageSource;
        }

        if(trimmedImageLicence && trimmedImageLicence !== saint.imageLicence) {
            updatedFields.imageLicence = trimmedImageLicence;
        }

        if(updatedBirthYear && updatedBirthYear !== saint.birthYear) {
            updatedFields.birthYear = updatedBirthYear;
        }

        if(updatedDeathYear && updatedDeathYear !== saint.deathYear) {
            updatedFields.deathYear = updatedDeathYear;
        }

        if(updatedCanonizationYear && updatedCanonizationYear !== saint.canonizationYear) {
            updatedFields.canonizationYear = updatedCanonizationYear;
        }

        if(Object.keys(updatedFields).length === 0) {
            alert("No changed detected.");
            return;
        }

        try {
            await onUpdate(saint.id, updatedFields);
            alert("Update successful!");
            onClose();
        } catch (error) {
            console.error("Failed to update saint, ", error);
            alert("Failed to update saint. Please try again.")
        }
    }

    if(!saint) {
        return null;
    }
    
    return (
        <Modal visible={visible} animationType="slide">
            <View style={[Layout.container, {backgroundColor: theme.saint.background}]}>
                <Text style={[Typography.title, {color: theme.saint.text}]}>Edit Saint</Text>
                <TextInput
                    placeholder="Enter name"
                    style={Layout.input}
                    value={name}
                    onChangeText={(value) => setName(value)}
                />
                <TextInput
                    placeholder="Enter birth year"
                    style={Layout.input}
                    keyboardType="numeric"
                    value={birthYear.toString()}
                    onChangeText={(value) => setBirthYear(parseInt(value) || 0)}
                />
                <TextInput
                    placeholder="Enter death year"
                    style={Layout.input}
                    keyboardType="numeric"
                    value={deathYear.toString()}
                    onChangeText={(value) => setDeathYear(parseInt(value) || 0)}
                />
                <TextInput
                    placeholder="Enter feast day"
                    style={Layout.input}
                    value={feastDay ?? ""}
                    onChangeText={(value) => setFeastDay(value)}
                />
                <TextInput
                    placeholder="Enter biography"
                    style={Layout.input}
                    value={biography}
                    onChangeText={(value) => setBiography(value)}
                />
                <TextInput
                    placeholder="Enter patronage"
                    style={Layout.input}
                    value={patronage}
                    onChangeText={(value) => setPatronage(value)}
                />
                <TextInput
                    placeholder="Enter canonization year"
                    style={Layout.input}
                    keyboardType="numeric"
                    value={canonizationYear.toString()}
                    onChangeText={(value) => setCanonizationYear(parseInt(value) || 0)}
                />
                <TextInput
                    placeholder="Enter image url"
                    style={Layout.input}
                    value={imageUrl ?? ""}
                    onChangeText={(value) => setImageUrl(value)}
                />
                <TextInput 
                    placeholder="Enter image author" 
                    style={Layout.input} 
                    value={imageAuthor ?? ""}
                    onChangeText={setImageAuthor} 
                />
                <TextInput 
                    placeholder="Enter image source" 
                    style={Layout.input} 
                    value={imageSource ?? ""} 
                    onChangeText={setImageSource} 
                />
                <TextInput 
                    placeholder="Enter image licence" 
                    style={Layout.input} 
                    value={imageLicence ?? ""} 
                    onChangeText={setImageLicence} 
                />
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <TouchableOpacity style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: theme.saint.navbar, borderWidth: 1}]} onPress={onHandleSubmit}>
                        <Text style={[Layout.buttonText, {color: "black"}]}>Save changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Layout.button, {backgroundColor: "gray", width: "40%", alignSelf: "center", borderWidth: 1}]} onPress={onClose}> 
                        <Text style={[Layout.buttonText, {color: "white"}]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default SaintUpdateModal;