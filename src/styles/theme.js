export const theme = {
    token: {
        colorPrimary: '#D4AF37', // Gold
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#f5222d',
        colorInfo: '#6B46C1', // Purple
        colorTextBase: '#1a1a1a',
        colorBgBase: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
        fontSize: 16,
        borderRadius: 8,
        controlHeight: 40,
    },
    components: {
        Button: {
            primaryColor: '#ffffff',
            defaultBorderColor: '#D4AF37',
            algorithm: true,
            controlHeight: 44,
            borderRadius: 8,
            fontWeight: 600,
        },
        Card: {
            borderRadiusLG: 16,
            paddingLG: 24,
        },
        Input: {
            controlHeight: 44,
            borderRadius: 8,
        },
        Form: {
            itemMarginBottom: 24,
            labelFontSize: 15,
        },
        Menu: {
            itemBorderRadius: 6,
        },
    },
};
