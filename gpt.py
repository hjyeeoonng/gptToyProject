from openai import OpenAI
import re
from apikey import api_key

client = OpenAI(
    api_key=api_key(),
)

def get_prompt(history):
    prompt = "chess notation of this game is : " + " ".join(history)
    prompt = prompt + "Your color is black, player color is white."
    prompt = prompt + "First line, Please answer in chess notation how you can put it next. It must be wrapped in {}"
    prompt = prompt + "And next line, please explain why you did it."
    #prompt = prompt + "\nFor example\n {your_answer}\n because~~~"
    return prompt 

#prompt = prompt + "Tell  3 good movements in the given notation situation and why."
def get_many_prompt_noexample(history):
    task_instruction = "Your color is black, player color is white. It's player's turn. Please recommend 5 good moves in a given notation situation for players with reasons in good order."
    prompt = "chess notation of this game is : " + " ".join(history)
    return task_instruction + "\n" + prompt

def get_many_prompt_noexample10(history):
    task_instruction = "Your color is black, player color is white. It's player's turn. Please recommend 3 good moves in a given notation situation for players in good order.(About 1600 Rating score)"
    task_instruction = task_instruction + "Please recommend 4 normal moves in a given notation situation for players in good order.(About 800 Rating score)"
    task_instruction = task_instruction + "And please recommend 3 bad moves in a given notation situation for players in good order.(About 300 Rating score)"
    task_instruction = task_instruction + "In the last part, reorganize the move you wrote in json form."
    prompt = "chess notation of this game is : " + " ".join(history)
    return task_instruction + "\n" + prompt 

def get_many_prompt(history):
    task_instruction = "Your color is black, player color is white. It's player's turn. Please recommend 5 good moves in a given notation situation for players with reasons in good order. Please refer to the example below when answering."
    examples = '''
    Q: Your color is black, player color is white. It's player's turn. Please recommend 5 good moves in a given notation situation for players with reasons in good order. Please refer to the example below when answering. chess notation of this game is : ['1.e4 e5']
    A: {Nf3, d4, Bc4, Nc3, O-O}
    1. Nf3: This move develops the knight and controls the center of the board. It also prepares for future development of the bishop to f4.
    2. d4: This move helps to open up the center and gain more control over the board. It also allows for potential quick development of the queen and the light-square bishop.
    3. Bc4: By developing the bishop to c4, white puts pressure on the f7 square, which is a weak spot in black's position. This move also opens up the possibility of lining up the bishop with the queen on the central file.
    4. Nc3: This move continues with the development of the knights and aims to establish more control in the center. It also prepares for potential future pawn breaks in the center with moves like d4 or e5.
    5. O-O: Castling kingside not only moves the king to safety but also connects the rooks and improves the overall coordination of the pieces. This move is essential for protecting the king and preparing for the middlegame.

    Q:Your color is black, player color is white. It's player's turn. Please recommend 5 good moves in a given notation situation for players with reasons in good order. Please refer to the example below when answering. chess notation of this game is : ['1.e4 e5']
    A: {Nf3, d4, Bc4, Nc3, O-O}
    1. Nf3: This move develops the knight and controls the center of the board.
    2. d4: This move opens up the center, allowing for quicker piece development and creating potential for an aggressive game.
    3. Bc4: This move develops the bishop and puts pressure on the f7 square, potentially setting up for a quick attack.
    4. c3: This move prepares to develop the bishop to c4 while also reinforcing the central pawn on d4.
    5. Bb5: This move pins the black knight to the king, pressuring black to make a move that might not be optimal for their development.
    '''
    prompt = "chess notation of this game is : " + " ".join(history)

    example1 = '''
    Q: Your color is black, player color is white. It's player's turn. Please recommend 5 good moves in a given notation situation for players with reasons in good order. Please refer to the example below when answering. chess notation of this game is : ['1.e4 e5']
    A: {Nf3, d4, Bc4, Nc3, O-O}
    1. Nf3: This move develops the knight and controls the center of the board. It also prepares for future development of the bishop to f4.
    2. d4: This move helps to open up the center and gain more control over the board. It also allows for potential quick development of the queen and the light-square bishop.
    3. Bc4: By developing the bishop to c4, white puts pressure on the f7 square, which is a weak spot in black's position. This move also opens up the possibility of lining up the bishop with the queen on the central file.
    4. Nc3: This move continues with the development of the knights and aims to establish more control in the center. It also prepares for potential future pawn breaks in the center with moves like d4 or e5.
    5. O-O: Castling kingside not only moves the king to safety but also connects the rooks and improves the overall coordination of the pieces. This move is essential for protecting the king and preparing for the middlegame.
    '''
    
    prompt = "chess notation of this game is : " + " ".join(history)

    return task_instruction + "\n" + examples + "\n" + prompt


history = ['']
cnt = 0
while True:
    user = input("사용자: ")
    if user == '0':
        break
    else:
        cnt +=1
        history.append(str(cnt)+'.'+user)

        test = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "your a helpful chess teacher"
                },
                {
                    "role": "system",
                    "content": get_prompt(history),
                }
            ],
            model="gpt-3.5-turbo",
        )

        pattern = re.compile('\{([^}]+)')
        m = pattern.findall(test.choices[0].message.content)

        history[-1]=history[-1]+" "+m[0]

        print(test.choices[0].message.content)
        print(history)
'''
test2 = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "your a helpful chess teacher"
                },
                {
                    "role": "system",
                    "content": get_many_prompt(history),
                }
            ],
            model="gpt-3.5-turbo",
        )
print(test2.choices[0].message.content)
'''
