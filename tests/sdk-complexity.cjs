const ts = require('typescript');
const fs = require('node:fs');
for (const file of ['templates/web/src/components/ui/combobox.tsx', 'templates/web/src/components/ui/sdk-framework-picker.tsx']) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const scores = [];
  function visit(node) {
    if (ts.isFunctionLike(node) && node.body) {
      let score = 1;
      function count(child) {
        if (ts.isFunctionLike(child)) return;
        if (ts.isIfStatement(child) || ts.isConditionalExpression(child) || ts.isIterationStatement(child, false) || ts.isCaseClause(child) || ts.isCatchClause(child) || child.questionDotToken || (ts.isBinaryExpression(child) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(child.operatorToken.kind))) score++;
        ts.forEachChild(child, count);
      }
      count(node.body);
      scores.push({ line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1, complexity: score });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  console.log(JSON.stringify({ file, functions: scores.length, max: Math.max(...scores.map((s) => s.complexity)), total: scores.reduce((sum, s) => sum + s.complexity, 0), scores }, null, 2));
}
