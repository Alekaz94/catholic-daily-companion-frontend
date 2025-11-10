import { FlatList, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import licenses from "../../licenses.json";
import { Layout } from "../styles/Layout";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from "../hooks/useAppTheme";
import { Typography } from "../styles/Typography";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Divider from "../components/Divider";

type LicenseEntry = {
    licenses: string;
    repository?: string;
    publisher?: string;
    email?: string;
    path?: string;
    licenseFile?: string;
    packageName?: string;
};

type LicenseWithPackage = LicenseEntry & { packageName: string };

const licensesTyped = licenses as Record<string, LicenseEntry>;

const LicencesScreen = () => {
    const theme = useAppTheme();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const groupedLicenses: Record<string, LicenseWithPackage[]> = {};

    Object.entries(licensesTyped).forEach(([packageName, info])  => {
        const license = info.licenses || 'Unknown';
        if (!groupedLicenses[license]) groupedLicenses[license] = [];

        groupedLicenses[license].push({ ...info, licenses: license, packageName });
    });

    const toggleSection = (license: string) => {
        setOpenSections(prev => ({ ...prev, [license]: !prev[license] }));
    }

    const renderPackage = ({ item }: { item: LicenseEntry & { packageName: string} }) => (
        <View style={[Layout.card, { backgroundColor: theme.auth.background, marginVertical: 5, borderWidth: 1, borderColor: theme.auth.text }]}>
            <Text style={{ color: theme.auth.text, fontWeight: 'bold', fontSize: 16 }}>{item.packageName}</Text>
            <Text style={{ color: theme.auth.text }}>License: {item.licenses}</Text>
            {item.repository && (
                <TouchableOpacity onPress={() => item.repository && Linking.openURL(item.repository)}>
                    <Text style={[Typography.link, { color: theme.auth.text }]}>Repository: {item.repository}</Text>
                </TouchableOpacity>
            )}
            {item.publisher && <Text style={{ color: theme.auth.text }}>Publisher: {item.publisher}</Text>}
            {item.email && <Text style={{ color: theme.auth.text }}>Email: {item.email}</Text>}
        </View>
    )
    

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: theme.auth.navbar}}>
            <Navbar />
            <View style={[Layout.container, {backgroundColor: theme.auth.background}]}>
                <Text style={[Typography.italic, {paddingTop: 10, textAlign: "center", fontSize: 22, fontWeight: "600", color: theme.auth.text}]}>Licenses</Text> 
                <Divider />
                <FlatList
                    contentContainerStyle={{paddingBottom: 20, backgroundColor: theme.auth.background}}
                    data={Object.entries(groupedLicenses)}
                    keyExtractor={([license]) => license}
                    renderItem={({ item: [license, packages] }) => (
                        <View>
                            <TouchableOpacity
                                onPress={() => toggleSection(license)}
                                style={{
                                    padding: 15,
                                    backgroundColor: theme.auth.background,
                                    borderRadius: 8,
                                    marginVertical: 5,
                                    borderBottomWidth: 1,
                                    borderColor: theme.auth.text
                                }}
                            >
                                <Text style={{ color: theme.auth.text, fontWeight: 'bold' }}>
                                    {license} ({packages.length})
                                </Text>
                            </TouchableOpacity>

                            {openSections[license] && (
                                <FlatList
                                    data={packages}
                                    keyExtractor={pkg => pkg.packageName}
                                    renderItem={renderPackage}
                                    scrollEnabled={false}
                                />
                            )}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

export default LicencesScreen;