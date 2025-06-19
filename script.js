const URL = "./model/"; // Make sure model files are inside /model/
let recognizer;
let lastDetectedClass = "";

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    const recognizer = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        checkpointURL,
        metadataURL
    );

    await recognizer.ensureModelLoaded();
    return recognizer;
}

async function init() {
    recognizer = await createModel();
    const classLabels = recognizer.wordLabels();

    recognizer.listen(result => {
        const scores = result.scores;
        const maxIndex = scores.indexOf(Math.max(...scores));
        const predictedClass = classLabels[maxIndex];

        // Only update UI if detected class changes
        if (predictedClass !== lastDetectedClass && scores[maxIndex] > 0.75) {
            document.getElementById("current-command").innerText = predictedClass;
            lastDetectedClass = predictedClass;
        }
    }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.75,
        overlapFactor: 0.5
    });
}
