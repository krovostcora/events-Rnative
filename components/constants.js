// constants.js
export const BUTTON_STYLE = {
    borderRadius: 0,
    borderColor: '#bbb',
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

// OPTIONS (grey)
export const optionsButton = {
    backgroundColor: '#8f8f8f',
    borderColor: '#666',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 2,
    minWidth: 90,
    alignItems: 'center',
    letterSpacing: 1,
};

export const optionsButtonText = {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
};

// Small action button base style
export const actionButton = {
    backgroundColor: '#e0e0e0',
    borderColor: '#888', // unified border color
    borderWidth: 1,
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginLeft: 8,
    shadowColor: '#fff',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
};

// Edit button (blue text)
export const editButton = {
    ...actionButton,
};
export const editButtonText = {
    color: '#0033cc',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
};

// Delete button (red text)
export const deleteButton = {
    ...actionButton,
};
export const deleteButtonText = {
    color: '#cc0000',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
};

// Save button (green text)
export const saveButton = {
    ...actionButton,
};
export const saveButtonText = {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
};

// Cancel button (gray text)
export const cancelButton = {
    ...actionButton,
};
export const cancelButtonText = {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
};