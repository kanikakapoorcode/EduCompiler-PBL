/** Ready-made programs for the workspace — load and hit Compile to see the full pipeline. */

export interface CodeSample {
  id: string;
  name: string;
  description: string;
  code: string;
}

/** Large valid program — many declarations, prints, comments */
export const BIG_DEMO_PROGRAM = `// EduCompiler demo: student grade calculator
int mathScore = 85;
int scienceScore = 92;
int englishScore = 78;
int historyScore = 88;
int artScore = 95;

int total = mathScore + scienceScore;
int total2 = total + englishScore;
int finalSum = total2 + historyScore;
int grandTotal = finalSum + artScore;

float average = 87.6;
int roundedAvg = 88;

print(mathScore);
print(scienceScore);
print(englishScore);
print(historyScore);
print(artScore);
print(total);
print(grandTotal);
print(roundedAvg);

// end of program
`;

export const ERROR_DEMO_PROGRAM = `int a = 10;
int b = 20;
int result = a + mystery;
print(result);
`;

export const DUPLICATE_DEMO_PROGRAM = `int counter = 0;
int counter = 1;
print(counter);
`;

export const CODE_SAMPLES: CodeSample[] = [
  {
    id: "big",
    name: "Big demo (30+ lines)",
    description: "Full pipeline: tokens, tree, symbol table, semantic",
    code: BIG_DEMO_PROGRAM,
  },
  {
    id: "simple",
    name: "Simple sum",
    description: "Basic declarations and print",
    code: `int x = 10;
int y = 20;
int sum = x + y;
print(sum);`,
  },
  {
    id: "semantic-error",
    name: "Undeclared variable",
    description: "Triggers semantic error on mystery",
    code: ERROR_DEMO_PROGRAM,
  },
  {
    id: "syntax-error",
    name: "Missing semicolon",
    description: "Syntax error detection",
    code: `int x = 10
int y = 20;
print(x);`,
  },
  {
    id: "duplicate",
    name: "Duplicate declaration",
    description: "Same variable declared twice",
    code: DUPLICATE_DEMO_PROGRAM,
  },
];

export const DEFAULT_SAMPLE_CODE = BIG_DEMO_PROGRAM;
