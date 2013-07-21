import json
from random import randint

N = 25
RANGE = [0, 20]
KEYS = list('abcdef')
data = []

for n in range(N):
    field = dict(zip(KEYS, [randint(*RANGE) for _ in KEYS]))
    data.append(field)

f = open('data.json', 'w')
f.write(json.dumps(data))
f.close()
