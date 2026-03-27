const STOPWORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "that",
  "this",
  "have",
  "your",
  "you",
  "will",
  "more",
  "than",
  "about",
  "work",
  "role",
  "using",
  "years",
  "experience",
  "team",
  "skills",
  "project",
  "projects",
  "candidate",
  "strong",
  "based",
  "ability",
  "business",
  "industry",
  "support",
  "work",
  "using",
  "requirements",
  "requirements",
]);

const extractWords = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

const countWords = (words) =>
  words.reduce((counts, word) => {
    counts[word] = (counts[word] || 0) + 1;
    return counts;
  }, {});

const pickKeywords = (text, limit = 6) => {
  const words = extractWords(text);
  const counts = countWords(words);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word]) => word)
    .filter((word, index, array) => array.indexOf(word) === index)
    .slice(0, limit);
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const arraysIntersect = (source, compare) => source.filter((item) => compare.includes(item));

export const generateMockInterviewQuestions = (cvText, jdText) => {
  const jobKeywords = pickKeywords(jdText, 6);
  const cvKeywords = pickKeywords(cvText, 6);
  const sharedKeywords = arraysIntersect(jobKeywords, cvKeywords);
  const missingKeywords = jobKeywords.filter((keyword) => !cvKeywords.includes(keyword));
  const extraCvKeywords = cvKeywords.filter((keyword) => !jobKeywords.includes(keyword));

  const questions = [
    "Walk me through your most relevant experience for this role.",
  ];

  if (sharedKeywords.length) {
    questions.push(`Tell me about a project where you used ${capitalize(sharedKeywords[0])}.`);
  }

  if (missingKeywords.length) {
    questions.push(
      `This job description emphasizes ${capitalize(missingKeywords[0])}. How would you approach building or demonstrating that capability?`
    );
  }

  if (extraCvKeywords.length) {
    questions.push(
      `You mention ${capitalize(extraCvKeywords[0])} on your resume. What impact did that experience have?`
    );
  }

  if (jobKeywords.length) {
    questions.push(`How would you apply ${capitalize(jobKeywords[0])} to succeed in this position?`);
  }

  if (questions.length < 4) {
    questions.push("What makes you a strong fit for this role?");
  }

  return [...new Set(questions)].slice(0, 5);
};
