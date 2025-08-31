

const MAX_LYRICS_CHARS = 5000;
const MAX_STYLES_CHARS = 1000;

// --- DOM ELEMENT SELECTORS ---
const appContainer = document.getElementById('app-container') as HTMLDivElement;
const mainView = document.getElementById('main-view') as HTMLDivElement;
const libraryView = document.getElementById('library-view') as HTMLDivElement;

// Main View Elements
const lyricsInput = document.getElementById('lyrics-input') as HTMLTextAreaElement;
const lyricsCharCount = document.getElementById('lyrics-char-count') as HTMLDivElement;
const styleInput = document.getElementById('style-input') as HTMLInputElement;
const styleTagsContainer = document.getElementById('style-tags') as HTMLDivElement;
const styleCharCount = document.getElementById('styles-char-count') as HTMLDivElement;
const suggestedTagsContainer = document.getElementById('suggested-tags-container') as HTMLDivElement;
const songTitleInput = document.getElementById('song-title') as HTMLInputElement;
const instrumentalCheckbox = document.getElementById('instrumental-checkbox') as HTMLInputElement;
const vocalGenderSlider = document.getElementById('vocal-gender') as HTMLInputElement;
const weirdnessSlider = document.getElementById('weirdness') as HTMLInputElement;
const weirdnessValue = document.getElementById('weirdness-value') as HTMLSpanElement;
const styleInfluenceSlider = document.getElementById('style-influence') as HTMLInputElement;
const styleInfluenceValue = document.getElementById('style-influence-value') as HTMLSpanElement;
const clearAllBtn = document.getElementById('clear-all-btn') as HTMLButtonElement;
const savePromptBtn = document.getElementById('save-prompt-btn') as HTMLButtonElement;
const fixLyricsBtn = document.getElementById('fix-lyrics-btn') as HTMLButtonElement;
const createBtn = document.getElementById('create-btn') as HTMLButtonElement;
const myPromptsBtn = document.getElementById('my-prompts-btn') as HTMLButtonElement;
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement;

// "Write Lyrics" Modal elements
const writeModal = document.getElementById('modal') as HTMLDivElement;
const writeLyricsBtn = document.getElementById('write-lyrics-btn') as HTMLButtonElement;
const closeWriteModalBtn = writeModal.querySelector('.close-button') as HTMLSpanElement;
const modalTextarea = document.getElementById('modal-textarea') as HTMLTextAreaElement;
const modalSubmitBtn = document.getElementById('modal-submit-btn') as HTMLButtonElement;
const loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;

// "Create" Modal elements
const createModal = document.getElementById('create-modal') as HTMLDivElement;
const closeCreateModalBtn = createModal.querySelector('.close-button') as HTMLSpanElement;
const finalPromptDisplay = document.getElementById('final-prompt-display') as HTMLPreElement;
const copyPromptBtn = document.getElementById('copy-prompt-btn') as HTMLButtonElement;
const exportPromptBtn = document.getElementById('export-prompt-btn') as HTMLButtonElement;

// "Generate Lyrics" Modal elements
const generateLyricsBtn = document.getElementById('generate-lyrics-btn') as HTMLButtonElement;
const generateLyricsModal = document.getElementById('generate-lyrics-modal') as HTMLDivElement;
const closeGenerateLyricsModalBtn = generateLyricsModal.querySelector('.close-button') as HTMLSpanElement;
const generateLyricsInput = document.getElementById('generate-lyrics-input') as HTMLTextAreaElement;
const generateLyricsSubmitBtn = document.getElementById('generate-lyrics-submit-btn') as HTMLButtonElement;
const generateLyricsLoading = document.getElementById('generate-lyrics-loading') as HTMLDivElement;

// Library View Elements
const backToMainBtn = document.getElementById('back-to-main-btn') as HTMLButtonElement;
const promptList = document.getElementById('prompt-list') as HTMLUListElement;
const emptyLibraryMessage = document.getElementById('empty-library-message') as HTMLDivElement;


let styleTags: string[] = [];
let debounceTimer: number;

// --- STATE & HISTORY MANAGEMENT ---
interface AppState {
    lyrics: string;
    title: string;
    styles: string[];
    isInstrumental: boolean;
    vocalGender: string;
    weirdness: string;
    styleInfluence: string;
}

// FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
let stateHistory: AppState[] = [];
let redoStack: AppState[] = [];
let isUndoingOrRedoing = false;

function getCurrentState(): AppState {
    return {
        lyrics: lyricsInput.value,
        title: songTitleInput.value,
        styles: [...styleTags],
        isInstrumental: instrumentalCheckbox.checked,
        vocalGender: vocalGenderSlider.value,
        weirdness: weirdnessSlider.value,
        styleInfluence: styleInfluenceSlider.value,
    };
}

function updateUndoRedoButtons() {
    // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
    undoBtn.disabled = stateHistory.length <= 1;
    redoBtn.disabled = redoStack.length === 0;
}

function recordState() {
    if (isUndoingOrRedoing) return;

    const currentState = getCurrentState();
    // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
    const lastState = stateHistory[stateHistory.length - 1];
    if (lastState && JSON.stringify(lastState) === JSON.stringify(currentState)) {
        return; // Don't record duplicate states
    }

    // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
    stateHistory.push(currentState);
    redoStack = []; // Clear redo stack on a new action
    updateUndoRedoButtons();
}

function handleUndo() {
    // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
    if (stateHistory.length > 1) {
        // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
        const currentState = stateHistory.pop()!;
        redoStack.push(currentState);
        // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
        const prevState = stateHistory[stateHistory.length - 1];
        applyState(prevState);
        updateUndoRedoButtons();
    }
}

function handleRedo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop()!;
        // FIX: Renamed `history` to `stateHistory` to avoid conflict with `window.history`.
        stateHistory.push(nextState);
        applyState(nextState);
        updateUndoRedoButtons();
    }
}


// --- UI RENDERING & VIEW MANAGEMENT ---

function updateStylesCharCount() {
    const currentLength = styleTags.reduce((acc, tag) => acc + tag.length, 0);
    styleCharCount.textContent = `${currentLength} / ${MAX_STYLES_CHARS}`;
    styleCharCount.style.color = currentLength > MAX_STYLES_CHARS ? 'var(--accent-pink)' : 'var(--secondary-text)';
}

function renderStyleTags() {
    styleTagsContainer.innerHTML = '';
    styleTags.forEach((tag, index) => {
        const tagElement = document.createElement('div');
        tagElement.className = 'style-tag';
        tagElement.textContent = tag;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-tag';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            styleTags.splice(index, 1);
            renderStyleTags();
            fetchAndRenderSuggestions();
            recordState();
        };
        tagElement.appendChild(removeBtn);
        styleTagsContainer.appendChild(tagElement);
    });
    updateStylesCharCount();
}

function renderSuggestedTags(suggestions: string[]) {
    const refreshIcon = suggestedTagsContainer.querySelector('span');
    suggestedTagsContainer.innerHTML = ''; 
    if (refreshIcon) {
        suggestedTagsContainer.appendChild(refreshIcon);
    }

    suggestions.forEach(suggestion => {
        if (styleTags.includes(suggestion)) return; 

        const button = document.createElement('button');
        button.className = 'tag';
        button.textContent = suggestion;
        button.onclick = () => {
            const currentLength = styleTags.reduce((acc, tag) => acc + tag.length, 0);
            if (currentLength + suggestion.length > MAX_STYLES_CHARS) {
                alert(`Cannot add tag. Total style characters cannot exceed ${MAX_STYLES_CHARS}.`);
                return;
            }
            styleTags.push(suggestion);
            renderStyleTags();
            styleInput.value = '';
            fetchAndRenderSuggestions(); 
            recordState();
        };
        suggestedTagsContainer.appendChild(button);
    });
}

function applyState(data: any) {
    isUndoingOrRedoing = true;

    lyricsInput.value = data.lyrics || '';
    updateLyricsCharCount();
    songTitleInput.value = data.title || '';
    styleTags = data.styles && Array.isArray(data.styles) ? [...data.styles] : [];
    renderStyleTags();
    fetchAndRenderSuggestions();
    instrumentalCheckbox.checked = typeof data.isInstrumental === 'boolean' ? data.isInstrumental : false;
    weirdnessSlider.value = data.weirdness || '50';
    weirdnessValue.textContent = `${weirdnessSlider.value}%`;
    styleInfluenceSlider.value = data.styleInfluence || '50';
    styleInfluenceValue.textContent = `${styleInfluenceSlider.value}%`;
    vocalGenderSlider.value = data.vocalGender || '50';

    setTimeout(() => { isUndoingOrRedoing = false; }, 0);
}

function updateLyricsCharCount() {
    const currentLength = lyricsInput.value.length;
    lyricsCharCount.textContent = `${currentLength} / ${MAX_LYRICS_CHARS}`;
    lyricsCharCount.style.color = currentLength > MAX_LYRICS_CHARS ? 'var(--accent-pink)' : 'var(--secondary-text)';
}

function showLibraryView() {
    renderPromptLibrary();
    appContainer.classList.add('show-library');
}

function showMainView() {
    appContainer.classList.remove('show-library');
}


// --- ASYNC & EVENT HANDLERS ---

// --- PROMPT LIBRARY (LOCAL STORAGE) ---

function getPromptLibrary(): any[] {
    const library = localStorage.getItem('sunoPromptLibrary');
    return library ? JSON.parse(library) : [];
}

function savePromptToLibrary(promptData: any) {
    const library = getPromptLibrary();
    library.push(promptData);
    localStorage.setItem('sunoPromptLibrary', JSON.stringify(library));
}

function deletePromptFromLibrary(promptId: number) {
    let library = getPromptLibrary();
    library = library.filter(p => p.id !== promptId);
    localStorage.setItem('sunoPromptLibrary', JSON.stringify(library));
    renderPromptLibrary(); // Re-render the list
}

function handleSavePrompt() {
    if (!songTitleInput.value.trim()) {
        alert("Please enter a song title before saving to the library.");
        songTitleInput.focus();
        return;
    }

    const promptData = {
        id: Date.now(),
        ...getCurrentState()
    };

    savePromptToLibrary(promptData);

    savePromptBtn.disabled = true;
    savePromptBtn.textContent = 'Saved!';
    setTimeout(() => {
        savePromptBtn.disabled = false;
        savePromptBtn.textContent = 'Save to Library';
    }, 2000);
}


function renderPromptLibrary() {
    const library = getPromptLibrary();
    promptList.innerHTML = '';

    if (library.length === 0) {
        emptyLibraryMessage.classList.remove('hidden');
    } else {
        emptyLibraryMessage.classList.add('hidden');
        library.reverse().forEach(prompt => { // Show newest first
            const listItem = document.createElement('li');
            listItem.className = 'prompt-list-item';

            const stylesHtml = prompt.styles.map((tag: string) => `<div class="style-tag">${tag}</div>`).join('');

            listItem.innerHTML = `
                <div class="prompt-item-header">
                    <h3>${prompt.title}</h3>
                </div>
                <div class="prompt-item-styles">
                    ${stylesHtml || 'No styles defined'}
                </div>
                <div class="prompt-item-actions">
                    <button class="prompt-action-btn load-btn" data-id="${prompt.id}">Load</button>
                    <button class="prompt-action-btn delete-btn" data-id="${prompt.id}">Delete</button>
                </div>
            `;
            promptList.appendChild(listItem);
        });
    }
}

function handleLibraryActions(event: Event) {
    const target = event.target as HTMLElement;
    const promptId = parseInt(target.getAttribute('data-id') || '0', 10);
    if (!promptId) return;

    if (target.classList.contains('load-btn')) {
        const library = getPromptLibrary();
        const promptToLoad = library.find(p => p.id === promptId);
        if (promptToLoad) {
            applyState(promptToLoad);
            recordState();
            showMainView();
        }
    }

    if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this prompt?')) {
            deletePromptFromLibrary(promptId);
        }
    }
}


function clearAllFields() {
    const emptyState: AppState = {
        lyrics: '', title: '', styles: [], isInstrumental: false,
        vocalGender: '50', weirdness: '50', styleInfluence: '50'
    };
    applyState(emptyState);
    styleInput.value = '';
}

function handleExportPrompt() {
    const promptText = finalPromptDisplay.textContent;
    if (!promptText) return;

    // Use song title for filename, or a default. Sanitize the title.
    const songTitle = songTitleInput.value.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = songTitle ? `${songTitle}_prompt.txt` : 'suno_prompt.txt';

    const blob = new Blob([promptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


function setupEventListeners() {
    // Lyrics input & sliders
    lyricsInput.addEventListener('input', updateLyricsCharCount);
    weirdnessSlider.addEventListener('input', () => weirdnessValue.textContent = `${weirdnessSlider.value}%`);
    styleInfluenceSlider.addEventListener('input', () => styleInfluenceValue.textContent = `${styleInfluenceSlider.value}%`);
    
    // Collapsible sections
    document.querySelectorAll('[data-toggle="collapse"]').forEach(header => {
        header.addEventListener('click', () => header.closest('.collapsible')?.classList.toggle('open'));
    });

    // Style tag input
    styleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && styleInput.value.trim() !== '') {
            e.preventDefault();
            const newTag = styleInput.value.trim();
            const currentLength = styleTags.reduce((acc, tag) => acc + tag.length, 0);
            if (currentLength + newTag.length > MAX_STYLES_CHARS) {
                alert(`Cannot add tag. Total style characters cannot exceed ${MAX_STYLES_CHARS}.`);
                return;
            }
            if (!styleTags.includes(newTag)) {
                styleTags.push(newTag);
            }
            styleInput.value = '';
            renderStyleTags();
            fetchAndRenderSuggestions();
            recordState();
        }
    });

    styleInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => fetchAndRenderSuggestions(), 500);
    });

    // Modals
    writeLyricsBtn.addEventListener('click', () => writeModal.style.display = 'flex');
    closeWriteModalBtn.addEventListener('click', () => writeModal.style.display = 'none');
    modalSubmitBtn.addEventListener('click', handleParseAndApply);

    generateLyricsBtn.addEventListener('click', () => generateLyricsModal.style.display = 'flex');
    closeGenerateLyricsModalBtn.addEventListener('click', () => generateLyricsModal.style.display = 'none');
    generateLyricsSubmitBtn.addEventListener('click', handleGenerateLyrics);

    createBtn.addEventListener('click', () => {
        finalPromptDisplay.textContent = generateFinalPrompt();
        createModal.style.display = 'flex';
    });
    closeCreateModalBtn.addEventListener('click', () => createModal.style.display = 'none');
    copyPromptBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(finalPromptDisplay.textContent || '').then(() => {
            copyPromptBtn.textContent = 'Copied!';
            setTimeout(() => copyPromptBtn.textContent = 'Copy to Clipboard', 2000);
        });
    });
    exportPromptBtn.addEventListener('click', handleExportPrompt);

    window.addEventListener('click', (event) => {
        if (event.target === writeModal) writeModal.style.display = 'none';
        if (event.target === createModal) createModal.style.display = 'none';
        if (event.target === generateLyricsModal) generateLyricsModal.style.display = 'none';
    });

    // Workspace
    clearAllBtn.addEventListener('click', () => {
        clearAllFields();
        recordState();
    });
    savePromptBtn.addEventListener('click', handleSavePrompt);
    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);


    // Lyrics Actions
    fixLyricsBtn.addEventListener('click', handleFixLyrics);

    // View Switching
    myPromptsBtn.addEventListener('click', showLibraryView);
    backToMainBtn.addEventListener('click', showMainView);

    // Library Event Delegation
    promptList.addEventListener('click', handleLibraryActions);
    
    // Track changes for undo/redo
    const inputsToTrack: HTMLElement[] = [
        lyricsInput, songTitleInput, instrumentalCheckbox, 
        vocalGenderSlider, weirdnessSlider, styleInfluenceSlider
    ];
    inputsToTrack.forEach(input => {
        input.addEventListener('change', recordState);
    });
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    fetchAndRenderSuggestions();
    
    // Apply and record initial empty state to correctly initialize UI and counters
    const emptyState: AppState = {
        lyrics: '', title: '', styles: [], isInstrumental: false,
        vocalGender: '50', weirdness: '50', styleInfluence: '50'
    };
    applyState(emptyState);
    recordState(); // Record this clean state as the first item in history

    updateUndoRedoButtons();
});

// Re-add implementations for functions that were removed for brevity in the prompt
async function fetchAndRenderSuggestions() {
    const refreshIcon = suggestedTagsContainer.querySelector('span');
    suggestedTagsContainer.innerHTML = '';
    if (refreshIcon) {
        suggestedTagsContainer.appendChild(refreshIcon);
    }
    const loadingEl = document.createElement('div');
    loadingEl.textContent = '...';
    loadingEl.className = 'tag-suggestion-loading';
    suggestedTagsContainer.appendChild(loadingEl);

    try {
        const response = await fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                styleTags,
                styleInput: styleInput.value
            }),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const suggestions = await response.json();
        renderSuggestedTags(suggestions);

    } catch (error) {
        console.error("Failed to fetch style suggestions:", error);
        if (refreshIcon) {
            suggestedTagsContainer.innerHTML = '';
            suggestedTagsContainer.appendChild(refreshIcon);
        }
    }
}

async function handleFixLyrics() {
    const originalText = lyricsInput.value;
    if (!originalText.trim()) {
        return;
    }

    const originalButtonText = fixLyricsBtn.textContent;
    fixLyricsBtn.disabled = true;
    fixLyricsBtn.textContent = 'Fixing...';

    try {
        const response = await fetch('/api/fix-lyrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lyrics: originalText }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const fixedLyrics = await response.text();
        lyricsInput.value = fixedLyrics;
        updateLyricsCharCount();
        recordState();

    } catch (error) {
        console.error("Error fixing lyrics:", error);
        alert("Sorry, there was an error fixing the lyrics. Please try again.");
        lyricsInput.value = originalText; // Restore original text on error
    } finally {
        fixLyricsBtn.disabled = false;
        fixLyricsBtn.textContent = originalButtonText;
    }
}

function generateFinalPrompt() {
    let promptLines = [];

    if (songTitleInput.value.trim()) {
        promptLines.push(`Title: ${songTitleInput.value.trim()}`);
    }

    if (styleTags.length > 0) {
        promptLines.push(`Styles: ${styleTags.join(', ')}`);
    }

    if (instrumentalCheckbox.checked) {
        promptLines.push("Instrumental");
    } else {
        const genderValue = parseInt(vocalGenderSlider.value, 10);
        let vocalDesc = "neutral vocals";
        if (genderValue < 40) vocalDesc = "male vocals";
        if (genderValue > 60) vocalDesc = "female vocals";
        promptLines.push(`Vocals: ${vocalDesc}`);
    }

    promptLines.push(`Weirdness: ${weirdnessSlider.value}%`);
    promptLines.push(`Style Influence: ${styleInfluenceSlider.value}%`);

    let finalPrompt = promptLines.join('\n');

    if (lyricsInput.value.trim() && !instrumentalCheckbox.checked) {
        finalPrompt = `[Lyrics]\n${lyricsInput.value.trim()}\n\n[Prompt]\n${finalPrompt}`;
    }

    return finalPrompt;
}

async function handleParseAndApply() {
    const userInput = modalTextarea.value;
    if (!userInput.trim()) {
        alert("Please describe your song.");
        return;
    }

    loadingIndicator.classList.remove('hidden');
    modalSubmitBtn.disabled = true;

    try {
        const response = await fetch('/api/parse-song', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const parsedData = await response.json();
        
        const genderValue = parsedData.vocalGender === 'male' ? '20' : parsedData.vocalGender === 'female' ? '80' : '50';

        const newState: AppState = {
            lyrics: parsedData.lyrics || '',
            title: parsedData.title || '',
            styles: parsedData.styles || [],
            isInstrumental: parsedData.isInstrumental || false,
            vocalGender: genderValue,
            weirdness: parsedData.weirdness?.toString() || '50',
            styleInfluence: parsedData.styleInfluence?.toString() || '50',
        };
        
        applyState(newState);
        recordState();
        
        writeModal.style.display = 'none';
        modalTextarea.value = '';

    } catch (error) {
        console.error("Error parsing with Gemini:", error);
        alert("Sorry, there was an error parsing your request. Please try again.");
    } finally {
        loadingIndicator.classList.add('hidden');
        modalSubmitBtn.disabled = false;
    }
}

async function handleGenerateLyrics() {
    const theme = generateLyricsInput.value;
    if (!theme.trim()) {
        alert("Please describe a theme for your song.");
        return;
    }

    generateLyricsLoading.classList.remove('hidden');
    generateLyricsSubmitBtn.disabled = true;

    try {
        const response = await fetch('/api/generate-lyrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const generatedLyrics = await response.text();
        lyricsInput.value = generatedLyrics;
        updateLyricsCharCount();
        recordState();
        
        generateLyricsModal.style.display = 'none';
        generateLyricsInput.value = '';

    } catch (error) {
        console.error("Error generating lyrics with Gemini:", error);
        alert("Sorry, there was an error generating lyrics. Please try again.");
    } finally {
        generateLyricsLoading.classList.add('hidden');
        generateLyricsSubmitBtn.disabled = false;
    }
}