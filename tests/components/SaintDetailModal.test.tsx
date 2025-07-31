import React from "react";
import { act, fireEvent, render } from "@testing-library/react-native";
import { Saint } from "../../models/Saint";
import SaintDetailModal from "../../components/SaintDetailModal";

const mockSaint: Saint = {
    id: "absd",
    name: "St. Francis of Assisi",
    birthYear: 1181,
    deathYear: 1226,
    feastDay: "--10-04",
    patronage: "animals and the environment",
    canonizationYear: 1228,
    biography: "St. Francis of Assisi was a Catholic friar...",
    imageUrl: null,
};

describe("SaintDetailModal", () => {
    it("does not render if saint is null", () => {
        const { toJSON } = render(
            <SaintDetailModal visible={true} saint={null} onClose={jest.fn()} />
        );
        expect(toJSON()).toBeNull();
    });

    it("renders saint data correctly with fallback image", () => {
        const { getByText, getByRole } = render(
            <SaintDetailModal visible={true} saint={mockSaint} onClose={jest.fn()} />
        );

        expect(getByText("St. Francis of Assisi")).toBeTruthy();
        expect(getByText("ca 1181 - ca 1226 (Feast day: October 4)")).toBeTruthy();
        expect(getByText("Patron saint of animals and the environment")).toBeTruthy();
        expect(getByText("Canonized: 1228")).toBeTruthy();
        expect(getByText("St. Francis of Assisi was a Catholic friar...")).toBeTruthy();
        expect(getByText("Close")).toBeTruthy();
    })

    it("calls onClose when Close button is pressed", async () => {
        const onCloseMock = jest.fn();
        const { getByText} = render(
            <SaintDetailModal visible={true} saint={mockSaint} onClose={onCloseMock} />
        );

        await act(async () => {
            fireEvent.press(getByText("Close"));
        });
        expect(onCloseMock).toHaveBeenCalled();
    })

    it("formats feast day from '--MM-DD'", () => {
        const saint = { ...mockSaint, feastDay: "--12-25" };
        const { getByText } = render(
            <SaintDetailModal visible={true} saint={saint} onClose={jest.fn()} />
        )
        expect(getByText(/December 25/)).toBeTruthy();
    })

    it("formats feast day from 'YYYY-MM-DD'", () => {
        const saint = { ...mockSaint, feastDay: "2023-08-15" };
        const { getByText } = render(
            <SaintDetailModal visible={true} saint={saint} onClose={jest.fn()} />
        )
        expect(getByText(/August 15/)).toBeTruthy();
    })

    it("handles invalid feast day if feast day is null", () => {
        const saint = { ...mockSaint, feastDay: "Invalid-Feast" };
        const { getByText } = render(
            <SaintDetailModal visible={true} saint={saint} onClose={jest.fn()} />
        )
        expect(getByText(/Invalid-Feast/)).toBeTruthy();
    })
    

    it("handles 'No feast day.' if feast day is null", () => {
        const saint = { ...mockSaint, feastDay: null };
        const { getByText } = render(
            <SaintDetailModal visible={true} saint={saint} onClose={jest.fn()} />
        )
        expect(getByText(/No feast day/)).toBeTruthy();
    })
})