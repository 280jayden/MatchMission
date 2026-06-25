# questions.py

import time

# question set:
quiz_data = [
    {
        "id": "Q1",
        "prompt": "If you had a million dollars to give away today, which broad area would you fund first?",
        "options": [
            "1. Animals & Environment",
            "2. Human Rights & Justice",
            "3. Health & Medicine",
            "4. Arts & Culture",
            "5. Education & Discovery"
        ]
    },
    {
        "id": "Q2",
        "prompt": "Within that space, what are you most drawn to?",
        "options": {
            "Animals & Environment": [
                "1usehold pets", 
                "2. Protecting natural habitats", 
                "3. Fighting the climate crisis", 
                "4. Protecting oceans"
            ],
            "Arts & Culture": [
                "1. Performing arts (Music, Dance, Theater)",
                "2. Visual media and historical preservation",
                "3. Public media and alternative expressions"
            ],
            "Education & Discovery": [
                "1. General youth education and athletics",
                "2. Scientific and space exploration",
                "3. Medical research and disease studies"
            ],
            "Health & Medicine": [
                "1. Mental health and disability support",
                "2. Food security and housing stability",
                "3. Women's health and senior care"
            ],
            "Human Rights & Justice": [
                "1. Racial and gender equality",
                "2. Legal defense and voting rights",
                "3. Refugee support and global crises"
            ]
        }
    },
    {
        "id": "Q3",
        "prompt": "Issues rarely exist in a vacuum. What's a second cause you deeply care about?",
        "options": [
            "1. Animals",
            "2. Culture",
            "3. Education",
            "4. Health",
            "5. Justice",
            "6. Religion",
            "7. None"
        ]
    },
    {
        "id": "Q4",
        "prompt": "How do you prefer an organization tackles a problem?",
        "options": [
            "1. Direct relief (food, shelter)",
            "2. Scientific research",
            "3. Changing laws and policies",
            "4. Teaching and equipping others"
        ]
    },
    {
        "id": "Q5",
        "prompt": "Are you looking to help with immediate crises, or long-term prevention?",
        "options": [
            "1. Immediate crisis response",
            "2. Long-term systemic change"
        ]
    },
    {
        "id": "Q6",
        "prompt": "If this organization focuses on people, who do you most want to uplift?",
        "options": [
            "1. Children/Youth",
            "2. The elderly",
            "3. Veterans",
            "4. Immigrants/Refugees",
            "5. LGBTQ+ community",
            "6. Broad population"
        ]
    },
    {
        "id": "Q7",
        "prompt": "Do you specifically want to support organizations led by marginalized or specific communities?",
        "options": [
            "1. Women-led",
            "2. Black-led",
            "3. Indigenous-led",
            "4. AAPI-led",
            "5. Latine-led",
            "6. No preference"
        ]
    },
    {
        "id": "Q8",
        "prompt": "Should the organization be faith-based?",
        "options": [
            "1. Yes, Christian",
            "2. Yes, Islamic",
            "3. Yes, Jewish",
            "4. Yes, Hindu/Buddhist",
            "5. Strictly secular/No preference"
        ]
    },
    {
        "id": "Q9",
        "prompt": "What size of organization do you trust most with your donation?",
        "options": [
            "1. Small, grassroots (hyper-local impact)",
            "2. Medium (regional/state level)",
            "3. Large (global footprint, highly established)"
        ]
    },
    {
        "id": "Q10",
        "prompt": "Finally, in one short sentence, tell me why you want to donate today. What specifically breaks your heart or gives you hope?",
        "options": ["(Open text response)"]
    }
]



def run_quiz():
  print('='*50 + "\n")

  print("Welcome to MatchMission!\n")

  print('='*50 + "\n")
  name = input("What is your name? ")

  time.sleep(0.3)

  print(f"Let's find causes you actually care about, {name}.\n" )

  time.sleep(2.5)

  

  user_responses = {}

  for index, question in enumerate(quiz_data):

    # print question
    print(f"{question['prompt']}")

    # print answer options
    if question["id"] == "Q2":
      prev_answer = list(user_responses.values())[0]
      current_options = quiz_data[index]['options'][prev_answer[3:]]
    
    elif question["id"] == "Q10":
      user_responses[quiz_data[index]['prompt']] = input("\nYour answer: ")
      continue

    else:
      current_options = quiz_data[index]['options']
    
    for option in current_options:
      print(f" {option}")

    # answer loop
    # ensure the user entered a valid number choice
    valid_choice = False
    while not valid_choice:
      choice = input(f"Choose an option 1-{len(current_options)}: ")      
    
      # TODO: add try-except clause
      if (choice.isdigit()) and (1 <= int(choice)) and (int(choice) <= len(current_options)):
        valid_choice = True 

      else:
        print(f"Invalid choice. Please pick a number between 1 and {len(current_options)}")
          
      
    user_responses[quiz_data[index]['prompt']] = current_options[int(choice) - 1]
    print("\n")

  print("\n", "=" * 50)
  print("Quiz complete!")

  print(name, user_responses)
    

  return name, user_responses







