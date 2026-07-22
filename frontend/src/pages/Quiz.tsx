import { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import questions from '../data/questions.json';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types/question';
import { QuizResponse } from '../types/api';
import { useAuth } from '../components/AuthProvider';
import { API_URL } from '../config';
import LoadingText from '../components/LoadingText';
import '../styles/Quiz.css';

type Answers = {
    [questionId: number]: string | string[];
};

function Quiz() {
    const { refreshUser } = useAuth();
    const [answers, setAnswers] = useState<Answers>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const quizQuestions = questions as Question[];
    const [currentQid, setCurrentQid] = useState(0);
    const currentQ = quizQuestions[currentQid];

    function handleAnswer(qid: number, answer: string | string[]) {
        setAnswers((prev) => ({
            ...prev,
            [qid]: answer,
        }));
    }

    const handleSubmit = async () => {
        let filled = true;

        quizQuestions.forEach((q) => {
            const answer = answers[q.id];

            if (!answer || (q.type === 'checkbox' && answer.length === 0)) {
                filled = false;
            }
        });

        if (!filled) {
            alert('Some questions are not filled out.');
            return;
        }

        const formattedAnswers: QuizResponse[] = Object.entries(answers).map(
            ([questionId, answer]) => ({
                questionId: Number(questionId),
                answer,
            }),
        );

        setLoading(true);

        try {
            const quizResponse = await fetch(`${API_URL}/api/quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ responses: formattedAnswers }),
            });

            const quizData = await quizResponse.json();

            if (!quizResponse.ok) {
                // console.log("successfully sent answers to db")
                // navigate("/result");
                console.log(quizData.error);
                setLoading(false);
                return;
            }

            console.log('successfully sent answers to db');

            const scoreResponse = await fetch(`${API_URL}/api/score_orgs`, {
                method: 'POST',
                credentials: 'include',
            });

            const scoreData = await scoreResponse.json();

            if (!scoreResponse.ok) {
                console.log(scoreData.error);
                setLoading(false);
                return;
            }

            await refreshUser();
            navigate('/result', { state: { justCompleted: true } });
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingText text="Finding your matches"></LoadingText>;
    }

    // const debugSubmit = async () => {
    //     const fakeAnswers: QuizResponse[] = [
    //         { questionId: 1, answer: 'human_rights' },
    //         {
    //             questionId: 2,
    //             answer: [
    //                 'animals_environment',
    //                 'arts_culture',
    //                 'education',
    //                 'health',
    //                 'human_rights',
    //                 'religion',
    //             ],
    //         },
    //         { questionId: 3, answer: 'systemic_change' },
    //         { questionId: 4, answer: 'evidence_based' },
    //         { questionId: 5, answer: ['broad_impact'] },
    //         { questionId: 6, answer: 'community_strength' },
    //         { questionId: 7, answer: 'justice_equality' },
    //         { questionId: 8, answer: 'balanced_impact' },
    //         { questionId: 9, answer: 'no_preference' },
    //         { questionId: 10, answer: 'unsure' },
    //         { questionId: 11, answer: 'unsure' },
    //         { questionId: 12, answer: 'unsure' },
    //     ];

    //     setLoading(true);

    //     try {
    //         const quizResponse = await fetch(`${API_URL}/api/quiz`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             credentials: 'include',
    //             body: JSON.stringify({ responses: fakeAnswers }),
    //         });

    //         const quizData = await quizResponse.json();

    //         if (!quizResponse.ok) {
    //             // console.log("successfully sent answers to db")
    //             // navigate("/result");
    //             console.log(quizData.error);
    //             setLoading(false);
    //             return;
    //         }

    //         console.log('successfully sent answers to db');

    //         const scoreResponse = await fetch(`${API_URL}/api/score_orgs`, {
    //             method: 'POST',
    //             credentials: 'include',
    //         });

    //         const scoreData = await scoreResponse.json();

    //         if (!scoreResponse.ok) {
    //             console.log(scoreData.error);
    //             setLoading(false);
    //             return;
    //         }

    //         await refreshUser();
    //         navigate('/result', { state: { justCompleted: true } });
    //     } catch (err) {
    //         console.log(err);
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="page-background">
            <div className="quiz-container">
                <h1 style={{ textAlign: 'center', marginBottom: '-30px' }}>
                    Mission Matcher
                </h1>

                {currentQid == 0 && (
                    <>
                        <p style={{ textAlign: 'center' }}>
                            Your answers will help us understand your passions
                            and connect you with nonprofits that fit your goals,
                            values, and vision for making an impact. Take the
                            quiz and discover organizations worth supporting.
                        </p>

                        {/* <button onClick={debugSubmit} disabled={loading}>
                            {loading
                                ? 'MATCHING YOU...'
                                : 'secret debug button'}
                        </button> */}
                    </>
                )}

                <div className="card-container">
                    <p className="quiz-progress-text">
                        Question {currentQid + 1} / {quizQuestions.length}
                    </p>
                    <progress
                        value={(currentQid + 1) / 10}
                        className="quiz-progress"
                    />
                    {/* {quizQuestions.map((q) => (
                    <QuestionCard
                        key={q.id}
                        qid={q.id}
                        question={q.question}
                        type={q.type}
                        options={q.options || []}
                        value={
                            answers[q.id] || (q.type === 'checkbox' ? [] : '')
                        } // cuz only checkbox takes array
                        onChange={(answer) => handleAnswer(q.id, answer)}
                    />
                ))} */}
                    <QuestionCard
                        key={currentQ.id}
                        qid={currentQ.id}
                        question={currentQ.question}
                        type={currentQ.type}
                        options={currentQ.options || []}
                        value={
                            answers[currentQ.id] ||
                            (currentQ.type === 'checkbox' ? [] : '')
                        } // cuz only checkbox takes array
                        onChange={(answer) => handleAnswer(currentQ.id, answer)}
                    />
                </div>

                <div className="quiz-navigation">
                    {currentQid > 0 && (
                        <button
                            onClick={() => setCurrentQid((prev) => prev - 1)}
                        >
                            Back
                        </button>
                    )}

                    {currentQid < quizQuestions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQid((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'MATCHING YOU...' : 'SUBMIT QUIZ'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Quiz;
