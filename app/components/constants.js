// constants.js
export const BUTTON_STYLE = {
    borderRadius: 0,
    borderColor: '#bbb',
    // fontFamily: FONT,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
};

// PRIMARY (black)
export const primaryButton = {
    backgroundColor: '#111',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 36,
    minWidth: 120,
    alignItems: 'center',
    ...BUTTON_STYLE,
};

export const primaryButtonText = {
    color: '#fff',
    ...BUTTON_STYLE,
};

// SECONDARY (gray)
export const secondaryButton = {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 36,
    minWidth: 120,
    alignItems: 'center',
    ...BUTTON_STYLE,
};

export const secondaryButtonText = {
    color: '#222',
    ...BUTTON_STYLE,
};

// TOGGLE BUTTON (selectable)
export const toggleButton = {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 4,
    ...BUTTON_STYLE,
};

export const toggleButtonActive = {
    backgroundColor: '#111',
};

export const toggleButtonText = {
    color: '#fff',
    ...BUTTON_STYLE,
};
