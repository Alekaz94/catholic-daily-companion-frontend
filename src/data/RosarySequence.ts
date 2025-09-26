export interface RosaryStep {
    title?: string;
    prayerText: string;
    checkboxes: number;
    isMystery?: boolean;
}

export const fixedRosaryStart: RosaryStep[] = [
    {
        prayerText: "Sign of the Cross: \nIn the name of the Father, and of the Son, and of the Holy Spirit. Amen.", 
        checkboxes: 1
    },
    {
        prayerText: "Apostles' Creed: \nI believe in God, the Father almighty, \nCreator of heaven and earth, \nand in Jesus Christ, his only Son, our Lord, \nwho was conceived by the Holy Spirit, born of the Virgin Mary, \nsuffered under Pontius Pilate, was crucified, died and was buried, \nhe descended into hell, on the third day he rose again from the dead, \nhe ascended into heaven, and is seated at the right hand of God the Father almighty, \nfrom there he will come to judge the living and the dead. \nI believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.", 
        checkboxes: 1},
    {
        prayerText: "Our Father: \nOur Father, who art in heaven, hallowed be thy name, \nthy kingdom come, thy will be done on earth as it is in heaven. \nGive us this day our daily bread, and forgive us our trespasses \nas we forgive those who trespass against us, \nand lead us not into temptation, but deliver us from evil. \nAmen.", 
        checkboxes: 1},
    {
        prayerText: "Hail Mary: \nHail Mary, full of grace, the Lord is with you, \nblessed are you among women, and blessed is the fruit of your womb, Jesus. \nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. \nAmen.", 
        checkboxes: 3},
    {
        prayerText: "Glory Be: \nGlory be, to the Father, the Son, and the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. \nAmen", 
        checkboxes: 1},
]

export const createMysteryDecade = (mystery: string): RosaryStep[] => [
    {
        title: mystery, 
        prayerText: "Our Father: \nOur Father, who art in heaven, hallowed be thy name, \nthy kingdom come, thy will be done on earth as it is in heaven. \nGive us this day our daily bread, and forgive us our trespasses \nas we forgive those who trespass against us, \nand lead us not into temptation, but deliver us from evil. \nAmen.", 
        checkboxes: 1, 
        isMystery: true
    },
    {
        prayerText: "Hail Mary: \nHail Mary, full of grace, the Lord is with you, \nblessed are you among women, and blessed is the fruit of your womb, Jesus. \nHoly Mary, Mother of God, pray for us sinners, now and at the hour of our death. \nAmen.", 
        checkboxes: 10
    },
    {
        prayerText: "Glory Be: \nGlory be, to the Father, the Son, and the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. \nAmen", 
        checkboxes: 1
    },
]

export const fixedRosaryEnd: RosaryStep[] = [
    {
        prayerText: "Hail, Holy Queen (Salve Regina): \nHail, holy Queen, mother of mercy, our life, our sweetness, and our hope. \nTo you we cry, poor banished children of Eve, \nto you we send up our sighs, mourning and weeping in this valley of tears. \nTurn, then, most gracious advocate, your eyes of mercy toward us, \nand after this, our exile, show unto us the blessed fruit of your womb, Jesus. \nO clement, O loving, O sweet Virgin Mary.", 
        checkboxes: 1
    },
]

export const getTodaysMysteries = (): string[] => {
    const weekday = new Date().getDay();
    switch(weekday) {
        case 0:
        case 3:
            return [
                "1. The Resurrection of Jesus",
                "2. The Ascencion",
                "3. The Descent of the Holy Spirit on the Apostles",
                "4. The Assumption of Mary",
                "5. The Coronation of Mary"
            ];
        case 1:
        case 6:
            return [
                "1. The Annunciation",
                "2. Mary Visits Elisabeth",
                "3. The Nativity",
                "4. Presentation of Jesus at the Temple",
                "5. The Finding of Jesus in the Temple",
            ];
        case 2:
        case 5:
            return [
                "1. The Agony in the Garden of Gethsemane",
                "2. The Scourging of Jesus",
                "3. The Crowning of Thorns",
                "4. The Carrying of the Cross to Golgotha",
                "5. The Crucifixion of Jesus"
            ];
        case 4:
            return [
                "1. The Baptism of Jesus By John the Baptist",
                "2. Jesus Turns Water to Wine at the Wedding Feast at Cana",
                "3. Jesus Proclaims the Kingdom of God",
                "4. The Transfiguration",
                "5. The Institution of the Eucharist"
            ];
        default: 
            throw new Error("Invalid weekday")
    }
};

export const getWeekdayName = (date: Date): string => {
    return date.toLocaleDateString("en-US", {weekday: "long"});
}

export const getMysteryTypeForToday = (): string => {
    const weekday = new Date().getDay();
    switch(weekday) {
        case 0:
        case 3: 
            return "Glorious Mysteries";
        case 1:
        case 6:
            return "Joyful Mysteries";
        case 2:
        case 5:
            return "Sorrowful Mysteries";
        case 4:
            return "Luminous Mysteries";
        default:
            return "Mysteries";
    }
}