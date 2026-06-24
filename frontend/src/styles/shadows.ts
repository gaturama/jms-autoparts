import { ViewStyle } from "react-native";

export const shadows = {
    none: {} as ViewStyle,

    sm: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffSet: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    } as ViewStyle,

    md: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    } as ViewStyle,

    lg: {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    } as ViewStyle,

    accent: {
        elevation: 6,
        shadowColor: '#E94560',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    } as ViewStyle,
} as const;