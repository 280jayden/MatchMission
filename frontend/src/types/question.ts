/**
 * Represents a selectable option for a quiz question.
 *
 * Contains the stored value used for processing responses and the display
 * text shown to users.
 */
export type QuestionOption = {
    value: string;
    option: string;
};

/**
 * Defines the supported input types for quiz questions.
 *
 * Radio questions allow one selection, checkbox questions allow multiple
 * selections, and text questions allow free-form responses.
 */
export type QuestionType = 'radio' | 'checkbox' | 'text';

/**
 * Represents a quiz question displayed to users.
 *
 * Contains the question text, input type, and optional answer choices for
 * selection-based questions.
 */
export type Question = {
    id: number;
    question: string;
    type: QuestionType;
    options?: QuestionOption[];
};
