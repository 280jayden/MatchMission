


# 10 question quiz
questions = ["If you had a million dollars to give away today, which broad area would you fund first?",
    "Within that space, what are you most drawn to?",
    "Issues rarely exist in a vacuum. What's a second cause you deeply care about?",
    "How do you prefer an organization tackles a problem?",
    "How do you prefer an organization tackles a problem?",
    "If this organization focuses on people, who do you most want to uplift?",
    "Do you specifically want to support organizations led by marginalized or specific communities?",
    "Should the organization be faith-based?",
    "What size of organization do you trust most with your donation?",
    "Finally, in one short sentence, tell me why you want to donate today. What specifically breaks your heart or gives you hope?"
    ]
  


categories = {'Animals & Environment': ['cats', 'dogs'],
'Human Rights & Justice': [], 'Health & Medicine':[],
'Arts & Culture': [], 'Education & Discovery': []}



responses = []
if __name__ == "__main__":
    # Welcome msg
    print("Welcome to Match Mission")

    # Question 1 and 2 separately
    print(questions[0])
    for cat in categories:
        print(cat)
    
    response1 = int(input())
    
    # categories.pop(response1)
    # Q2

    # Questions 3 - 10
    for q in questions[2:]:
        print(q)
        response = input()