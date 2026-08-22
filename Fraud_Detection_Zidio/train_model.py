import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_data():
    paths_to_check = [
        os.path.join(BASE_DIR, "Related_files", "financial_fraud_detection_dataset.csv"),
        os.path.join(BASE_DIR, "Datasets", "financial_fraud_detection_dataset.csv"),
        os.path.join("Related_files", "financial_fraud_detection_dataset.csv"),
        os.path.join("Datasets", "financial_fraud_detection_dataset.csv"),
        os.path.join("Fraud_Detection_Zidio", "Datasets", "financial_fraud_detection_dataset.csv"),
        os.path.join("Fraud_Detection_Zidio", "Related_files", "financial_fraud_detection_dataset.csv")
    ]
    for p in paths_to_check:
        if os.path.exists(p):
            df = pd.read_csv(p)
            print(f"Dataset loaded successfully from '{p}': {df.shape[0]} rows, {df.shape[1]} columns.")
            return df
    raise FileNotFoundError("Dataset not found in Datasets/ or Related_files/")

def preprocess_and_engineer(df):
    df = df.copy()
    
    # Clean datetime
    df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'], format='%d-%m-%Y %H:%M', errors='coerce')
    df['Hour'] = df['Transaction_Date'].dt.hour.fillna(12).astype(int)
    df['DayOfWeek'] = df['Transaction_Date'].dt.dayofweek.fillna(0).astype(int)
    df['Is_Night_Txn'] = df['Hour'].apply(lambda h: 1 if (h >= 23 or h <= 5) else 0)
    
    # Feature ratios
    df['Spend_to_Avg_Ratio'] = df['Transaction_Amount'] / (df['Average_Spend'] + 1.0)
    df['Spend_Minus_Avg'] = df['Transaction_Amount'] - df['Average_Spend']
    
    # Suspicious Keyword
    df['Suspicious_Keyword_Num'] = df['Suspicious_Keyword'].apply(lambda x: 1 if str(x).strip().lower() in ['yes', '1', 'true'] else 0)
    df['Is_International'] = df['Is_International'].astype(int)
    
    # Categorical columns
    cat_cols = ['Merchant_Category', 'Payment_Method', 'Device_Type', 'Location']
    
    # Collect unique options for dropdowns in UI
    cat_options = {col: sorted(df[col].dropna().unique().tolist()) for col in cat_cols}
    
    # One-hot encode
    df_encoded = pd.get_dummies(df, columns=cat_cols, drop_first=False)
    
    # Identify target and drop irrelevant ID/Date columns
    drop_cols = ['Transaction_ID', 'Customer_ID', 'Transaction_Date', 'Suspicious_Keyword']
    feature_df = df_encoded.drop(columns=[c for c in drop_cols if c in df_encoded.columns])
    
    target_col = 'Fraudulent'
    X = feature_df.drop(columns=[target_col])
    y = feature_df[target_col]
    
    return X, y, cat_options, list(X.columns)

def train_and_evaluate():
    df = load_data()
    X, y, cat_options, feature_names = preprocess_and_engineer(df)
    
    print(f"Features dimension: {X.shape}")
    print(f"Fraud distribution:\n{y.value_counts(normalize=True)}")
    
    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Calculate class weight ratio safely
    neg_count = (y_train == 0).sum()
    pos_count = (y_train == 1).sum()
    scale_weight = float(neg_count) / float(pos_count) if pos_count > 0 else 1.0
    
    print(f"Negative count: {neg_count}, Positive count: {pos_count}, Scale weight: {scale_weight:.2f}")
    
    # Model definitions
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=10, class_weight='balanced', random_state=42, n_jobs=1),
        'XGBoost': XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, scale_pos_weight=scale_weight, random_state=42, eval_metric='logloss', n_jobs=1),
        'Logistic Regression': LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
    }
    
    best_model = None
    best_f1 = -1.0
    best_model_name = ""
    results = {}
    
    for name, model in models.items():
        if name in ['Random Forest', 'XGBoost']:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            y_proba = model.predict_proba(X_test)[:, 1]
        else:
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            y_proba = model.predict_proba(X_test_scaled)[:, 1]
            
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_proba)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        results[name] = {
            'Accuracy': float(acc),
            'Precision': float(prec),
            'Recall': float(rec),
            'F1_Score': float(f1),
            'ROC_AUC': float(auc),
            'Confusion_Matrix': cm
        }
        
        print(f"\n--- {name} ---")
        print(f"Accuracy: {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | AUC: {auc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model = model
            best_model_name = name
            
    print(f"\nBest Model Selected: {best_model_name} with F1-score = {best_f1:.4f}")
    
    # Create directory for artifacts
    artifacts_dir = "model_artifacts"
    os.makedirs(artifacts_dir, exist_ok=True)
    
    # Save artifacts
    joblib.dump(best_model, os.path.join(artifacts_dir, "fraud_model.pkl"))
    joblib.dump(scaler, os.path.join(artifacts_dir, "scaler.pkl"))
    
    feature_info = {
        'feature_names': feature_names,
        'cat_options': cat_options,
        'best_model_name': best_model_name
    }
    joblib.dump(feature_info, os.path.join(artifacts_dir, "feature_info.pkl"))
    
    with open(os.path.join(artifacts_dir, "model_metrics.json"), "w") as f:
        json.dump(results, f, indent=4)
        
    print(f"Artifacts successfully saved in '{artifacts_dir}' folder.")

if __name__ == "__main__":
    train_and_evaluate()
