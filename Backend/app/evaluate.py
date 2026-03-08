from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score

def evaluate_retrieval(relevant_chunks, retrieved_chunks):

    all_chunks = list(set(relevant_chunks + retrieved_chunks))

    y_true = []
    y_pred = []

    for chunk in all_chunks:

        if chunk in relevant_chunks:
            y_true.append(1)
        else:
            y_true.append(0)

        if chunk in retrieved_chunks:
            y_pred.append(1)
        else:
            y_pred.append(0)

    precision = precision_score(y_true, y_pred, zero_division=0)
    recall = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    accuracy = accuracy_score(y_true, y_pred, zero_division=0)

    return {
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "accuracy": accuracy
    }