// ── Neural Network Math ─────────────────────────────────────
// Simplified for pedagogical clarity. All client-side.

export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function sigmoidDerivative(output) {
  return output * (1 - output);
}

// Forward pass through a simple network:
// inputs (4) → hidden (2) → output (1)
export function forwardPass(inputs, weightsIH, weightsHO, biasH, biasO) {
  // Input → Hidden
  const hidden = biasH.map((b, h) => {
    let sum = b;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * weightsIH[i][h];
    }
    return sigmoid(sum);
  });

  // Hidden → Output
  let outputSum = biasO;
  for (let h = 0; h < hidden.length; h++) {
    outputSum += hidden[h] * weightsHO[h];
  }
  const output = sigmoid(outputSum);

  return { hidden, output };
}

// Single training step (simplified backpropagation)
export function trainStep(inputs, target, weightsIH, weightsHO, biasH, biasO, lr = 0.5) {
  const { hidden, output } = forwardPass(inputs, weightsIH, weightsHO, biasH, biasO);

  // Output error
  const outputError = target - output;
  const outputDelta = outputError * sigmoidDerivative(output);

  // Hidden errors
  const hiddenDeltas = hidden.map((h, idx) => {
    const error = outputDelta * weightsHO[idx];
    return error * sigmoidDerivative(h);
  });

  // Update weights: Hidden → Output
  const newWeightsHO = weightsHO.map((w, h) => w + lr * outputDelta * hidden[h]);
  const newBiasO = biasO + lr * outputDelta;

  // Update weights: Input → Hidden
  const newWeightsIH = weightsIH.map((row, i) =>
    row.map((w, h) => w + lr * hiddenDeltas[h] * inputs[i])
  );
  const newBiasH = biasH.map((b, h) => b + lr * hiddenDeltas[h]);

  return {
    weightsIH: newWeightsIH,
    weightsHO: newWeightsHO,
    biasH: newBiasH,
    biasO: newBiasO,
    output,
    error: Math.abs(outputError),
  };
}

// Train one epoch (all examples) and return updated weights + stats
export function trainEpoch(examples, weightsIH, weightsHO, biasH, biasO, lr = 0.5) {
  let totalError = 0;
  let correct = 0;
  let wIH = weightsIH.map(r => [...r]);
  let wHO = [...weightsHO];
  let bH = [...biasH];
  let bO = biasO;

  // Shuffle examples for each epoch
  const shuffled = [...examples].sort(() => Math.random() - 0.5);

  for (const ex of shuffled) {
    const result = trainStep(ex.inputs, ex.target, wIH, wHO, bH, bO, lr);
    wIH = result.weightsIH;
    wHO = result.weightsHO;
    bH = result.biasH;
    bO = result.biasO;
    totalError += result.error;

    const predicted = result.output >= 0.5 ? 1 : 0;
    if (predicted === ex.target) correct++;
  }

  const accuracy = correct / examples.length;
  const avgError = totalError / examples.length;

  return { weightsIH: wIH, weightsHO: wHO, biasH: bH, biasO: bO, accuracy, avgError };
}

// Calculate accuracy without training
export function calculateAccuracy(examples, weightsIH, weightsHO, biasH, biasO) {
  let correct = 0;
  const results = examples.map(ex => {
    const { output } = forwardPass(ex.inputs, weightsIH, weightsHO, biasH, biasO);
    const predicted = output >= 0.5 ? 1 : 0;
    const isCorrect = predicted === ex.target;
    if (isCorrect) correct++;
    return { ...ex, output, predicted, isCorrect };
  });
  return { accuracy: correct / examples.length, results };
}

// Generate random initial weights
export function randomWeights(inputs, hidden) {
  const weightsIH = Array.from({ length: inputs }, () =>
    Array.from({ length: hidden }, () => (Math.random() - 0.5) * 2)
  );
  const weightsHO = Array.from({ length: hidden }, () => (Math.random() - 0.5) * 2);
  const biasH = Array.from({ length: hidden }, () => (Math.random() - 0.5));
  const biasO = (Math.random() - 0.5);
  return { weightsIH, weightsHO, biasH, biasO };
}
