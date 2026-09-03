import pandas as pd
import json
import numpy as np
from typing import List, Dict, Any

# Read the Excel file
excel_file = r'c:\Users\ronty\Downloads\archive\Indian Coal Mines Dataset_January 2021-1.xlsx'
df = pd.read_excel(excel_file, sheet_name='Mines Datasheet')

print("Dataset loaded successfully!")
print(f"Shape: {df.shape}")
print(f"\nColumn names:\n{df.columns.tolist()}")
print(f"\nFirst few rows:\n{df.head()}")

# Data cleaning
df = df.dropna(subset=['Mine Name', 'State/UT Name'])
print(f"\nAfter cleaning: {df.shape}")

# Create standardized mine type mapping
def get_mine_type(type_str):
    if pd.isna(type_str):
        return 'OPENCAST'
    type_str = str(type_str).upper()
    if 'UG' in type_str:
        return 'UNDERGROUND'
    elif 'MIXED' in type_str:
        return 'MIXED'
    else:
        return 'OPENCAST'

# Create subsidiary code mapping
def get_subsidiary(owner_name):
    if pd.isna(owner_name):
        return 'CIL_HQ'
    owner_str = str(owner_name).upper()
    if 'ECL' in owner_str or 'EASTERN' in owner_str:
        return 'ECL'
    elif 'BCCL' in owner_str or 'BHARAT' in owner_str:
        return 'BCCL'
    elif 'CCL' in owner_str or 'CENTRAL' in owner_str:
        return 'CCL'
    elif 'WCL' in owner_str or 'WESTERN' in owner_str:
        return 'WCL'
    elif 'SECL' in owner_str or 'SOUTH' in owner_str:
        return 'SECL'
    elif 'MCL' in owner_str or 'MAHANADI' in owner_str:
        return 'MCL'
    elif 'NCL' in owner_str or 'NORTH' in owner_str:
        return 'NCL'
    else:
        return 'CIL_HQ'

# Parse coordinates
def safe_float(val, default=0.0):
    try:
        return float(val) if pd.notna(val) else default
    except:
        return default

# Build the mines data
mines_data = []
for idx, row in df.iterrows():
    mine_id = f"real-mine-{idx+1:04d}"
    
    mine = {
        "id": mine_id,
        "name": str(row.get('Mine Name', f'Mine {idx+1}')).strip(),
        "code": str(row.get('SL No.', idx+1)),
        "subsidiary": get_subsidiary(row.get('Coal Mine Owner Name')),
        "state": str(row.get('State/UT Name', 'Unknown')).strip(),
        "district": str(row.get('District Name', 'Unknown')).strip(),
        "type": get_mine_type(row.get('Type of Mine (OC/UG/Mixed)')),
        "coordinates": {
            "lat": safe_float(row.get('Latitude ')),
            "lng": safe_float(row.get('Longitude '))
        },
        "productionCapacityMTPA": safe_float(row.get('Coal/ Lignite Production (MT) (2019-2020)', 0)) * 1.2,
        "currentProductionMT": safe_float(row.get('Coal/ Lignite Production (MT) (2019-2020)', 0)),
        "coalType": str(row.get('Coal/Lignite', 'Coal')).strip(),
        "ownership": str(row.get('Govt Owned/Private', 'Unknown')).strip(),
        "source": str(row.get('Source', 'Dataset')).strip() if pd.notna(row.get('Source')) else 'Dataset',
        "accuracy": str(row.get('Accuracy (exact vs approximate)', 'Approximate')).strip(),
    }
    
    mines_data.append(mine)

print(f"\nProcessed {len(mines_data)} mines")

# Summary statistics by state
print("\n" + "="*60)
print("MINES BY STATE:")
print("="*60)
state_summary = df['State/UT Name'].value_counts()
print(state_summary)

# Save to JSON
output_json = {
    "metadata": {
        "source": "Indian Coal Mines Dataset - January 2021",
        "totalMines": len(mines_data),
        "minesByState": state_summary.to_dict(),
        "dataCollectionDate": "January 2021",
        "lastUpdated": pd.Timestamp.now().isoformat()
    },
    "mines": mines_data
}

output_file = r'c:\Users\ronty\SIH26\src\data\realMinesData.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output_json, f, indent=2, ensure_ascii=False)

print(f"\n✓ JSON file saved to: {output_file}")
print(f"✓ Total records: {len(mines_data)}")
print(f"✓ File size: {len(json.dumps(output_json))} bytes")

# Generate preview
print("\n" + "="*60)
print("SAMPLE RECORDS:")
print("="*60)
for mine in mines_data[:3]:
    print(f"\nMine: {mine['name']}")
    print(f"State: {mine['state']}, District: {mine['district']}")
    print(f"Type: {mine['type']}, Production (2019-20): {mine['currentProductionMT']} MT")
    print(f"Coordinates: ({mine['coordinates']['lat']}, {mine['coordinates']['lng']})")
