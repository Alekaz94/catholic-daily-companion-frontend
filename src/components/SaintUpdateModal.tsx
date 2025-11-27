import { useEffect, useState } from "react";
import { Saint, UpdatedSaint } from "../models/Saint";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Layout } from "../styles/Layout";
import { useTypography } from "../styles/Typography";
import { useAppTheme } from '../hooks/useAppTheme';
import { useRequireAuth } from "../hooks/useRequireAuth";

interface Props {
    visible: boolean;
    saint: Saint | null;
    onClose: () => void;
    onUpdate: (id: string, updatedSaint: UpdatedSaint) => void;
}

const SaintUpdateModal = ({ visible, saint, onClose, onUpdate}: Props) => {
    const user = useRequireAuth();
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
    const Typography = useTypography();

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
    }, [saint, user]);

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

        const updatedFields: UpdatedSaint = {};

        if(trimmedName && trimmedName !== saint.name) {
            updatedFields.name = trimmedName;
        }

        if(trimmedBiography && trimmedBiography !== saint.biography) {
            updatedFields.biography = trimmedBiography;
        }
    
        if(trimmedFeastDay && trimmedFeastDay !== saint.feastDay) {
            const match = trimmedFeastDay.match(/^--?(\d{1,2})-(\d{1,2})$/);

            if(!match) {
                alert("Feast day must be in format --MM-dd");
                return;
            }

            const month = parseInt(match[1], 10);
            const day = parseInt(match[2], 10);
            
            if(month < 1 || month > 12) {
                alert("Month must be between 1 and 12");
                return;
            }

            const daysInMonth = new Date(2024, month, 0).getDate();

            if(day < 1 || day > daysInMonth) {
                alert(`Day must be between 1 and ${daysInMonth} for month ${month}`);
                return;
            }

            const paddedMonth = month.toString().padStart(2, "0");
            const paddedDay = day.toString().padStart(2, "0");
            
            updatedFields.feastDay = `--${paddedMonth}-${paddedDay}`;
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
                    placeholder="Enter name (Required)"
                    style={Layout.input}
                    value={name}
                    onChangeText={(value) => setName(value)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter birth year"
                    style={Layout.input}
                    keyboardType="numeric"
                    value={birthYear ? String(birthYear) : ""}
                    onChangeText={(value) => setBirthYear(parseInt(value) || 0)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter death year"
                    style={Layout.input}
                    keyboardType="numeric"
                    value={deathYear ? String(deathYear) : ""}
                    onChangeText={(value) => setDeathYear(parseInt(value) || 0)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter feast day (Required | --MM-dd)"
                    style={Layout.input}
                    value={feastDay ?? ""}
                    onChangeText={(value) => setFeastDay(value)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter biography (Required | min 10 characters)"
                    style={Layout.input}
                    value={biography}
                    onChangeText={(value) => setBiography(value)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter patronage (Required)"
                    style={Layout.input}
                    value={patronage}
                    onChangeText={(value) => setPatronage(value)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter canonization year"
                    style={Layout.input}
                    keyboardType="numeric"
                    value={canonizationYear ? String(canonizationYear) : ""}
                    onChangeText={(value) => setCanonizationYear(parseInt(value) || 0)}
                    placeholderTextColor={"black"}
                />
                <TextInput
                    placeholder="Enter image url"
                    style={Layout.input}
                    value={imageUrl ?? ""}
                    onChangeText={(value) => setImageUrl(value)}
                    placeholderTextColor={"black"}
                />
                <TextInput 
                    placeholder="Enter image source" 
                    style={Layout.input} 
                    value={imageSource ?? ""} 
                    onChangeText={(value) => setImageSource(value)} 
                    placeholderTextColor={"black"}
                />
                <TextInput 
                    placeholder="Enter image author" 
                    style={Layout.input} 
                    value={imageAuthor ?? ""}
                    onChangeText={(value) => setImageAuthor(value)}
                    placeholderTextColor={"black"} 
                />
                <TextInput 
                    placeholder="Enter image licence" 
                    style={Layout.input} 
                    value={imageLicence ?? ""} 
                    onChangeText={(value) => setImageLicence(value)}
                    placeholderTextColor={"black"}
                />
                <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                    <TouchableOpacity style={[Layout.button, {backgroundColor: "lightgray", width: "40%", alignSelf: "center"}]} onPress={onClose}> 
                        <Text style={[Typography.label, {color: theme.auth.text, textAlign: "center"}]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Layout.button, {width: "40%", alignSelf: "center", backgroundColor: theme.auth.background}]} onPress={onHandleSubmit}>
                        <Text style={[Typography.label, {color: theme.auth.text, textAlign: "center"}]}>Save changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default SaintUpdateModal;