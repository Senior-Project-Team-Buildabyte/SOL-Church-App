import { ButtonShape, GenericButtonConfig } from "@/models/ButtonConfig";
import { FC } from "react";
import { View, StyleSheet } from "react-native";
import LinkPageButton from "../restricted/link-page-button";

const styles = StyleSheet.create({
    container: {
        maxWidth: 650,
        width: '100%',
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    fullWidthItem: {
        width: '100%',
    },
    squareItem: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});


const DynamicButton: FC<{ buttons: GenericButtonConfig[] }> = ({ buttons }) => {
    if (!Array.isArray(buttons)) {
        console.error("Expected 'buttons' to be an array but got:", buttons);
        return null;
    }

    // Group buttons into rows based on shape
    const rows: GenericButtonConfig[][] = []; // <-- Now using GenericButtonConfig[]
    let currentRow: GenericButtonConfig[] = [];
    let currentRowType: 'full' | 'square' | null = null;

    buttons.forEach((button) => {
        const isSquare = button.shape === ButtonShape.Square;

        // Start new row if shape type changes
        if (
        !currentRowType ||
        (isSquare && currentRowType === 'full') ||
        (!isSquare && currentRowType === 'square')
        ) {
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [button];
        currentRowType = isSquare ? 'square' : 'full';
        } else {
        currentRow.push(button);
        }
    });

    // Push the last remaining row
    if (currentRow.length > 0) rows.push(currentRow);

    return (
        <View style={styles.container}>
        {rows.map((row, rowIndex) => (
            // full row
            <View
            key={`row-${rowIndex}`}
            style={[
                styles.row
            ]}>
            {row.map((button, btnIndex) => (
                <View
                key={`btn-${rowIndex}-${btnIndex}`}
                style={ // handle styles for individual square or full buttons
                    button.shape === ButtonShape.Square
                    ? styles.squareItem : styles.fullWidthItem
                }>
                    <LinkPageButton
                    type={button.type}
                    shape={button.shape}
                    buttonConfig={button.buttonConfig}/>
                </View>
            ))}
            </View>
        ))}
        </View>
    );
};

export default DynamicButton;