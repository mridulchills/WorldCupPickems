import json

with open('d:\\WorldCupPickems\\wikitext.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

routing = {}
winners = ["A1", "B1", "D1", "E1", "G1", "I1", "K1", "L1"]

current_row_cells = []
in_row = False

for line in lines:
    line = line.strip()
    if line.startswith('|-'):
        # process previous row
        if len(current_row_cells) >= 20:
            # The first column might be the row number, e.g. "! scope="row" | 1"
            # we need to find the cells that are the 12 groups + 8 assignments.
            # Usually the groups are letters enclosed in '''
            groups_qualified = []
            assignments = []
            
            for cell in current_row_cells:
                cell = cell.strip()
                if "'''" in cell:
                    letter = cell.replace("'''", "").strip()
                    if len(letter) == 1 and 'A' <= letter <= 'L':
                        groups_qualified.append(letter)
                elif cell.startswith('3'):
                    assignments.append(cell)
            
            if len(groups_qualified) == 8 and len(assignments) == 8:
                combo_key = "".join(sorted(groups_qualified))
                mapping = {}
                for i, winner in enumerate(winners):
                    third = assignments[i]
                    if third and third != '-':
                        mapping[winner] = third
                        mapping[third] = winner
                routing[combo_key] = mapping
                
        current_row_cells = []
        continue
        
    if line.startswith('|') and not line.startswith('|+') and not line.startswith('|}'):
        # Split by || or | 
        parts = line.split('||')
        for part in parts:
            part = part.strip()
            if part.startswith('|'):
                part = part[1:].strip()
            current_row_cells.append(part)
            
# Process last row
if len(current_row_cells) >= 20:
    groups_qualified = []
    assignments = []
    for cell in current_row_cells:
        cell = cell.strip()
        if "'''" in cell:
            letter = cell.replace("'''", "").strip()
            if len(letter) == 1 and 'A' <= letter <= 'L':
                groups_qualified.append(letter)
        elif cell.startswith('3'):
            assignments.append(cell)
    
    if len(groups_qualified) == 8 and len(assignments) == 8:
        combo_key = "".join(sorted(groups_qualified))
        mapping = {}
        for i, winner in enumerate(winners):
            third = assignments[i]
            if third and third != '-':
                mapping[winner] = third
                # Add reverse mapping
                mapping[third] = winner
        routing[combo_key] = mapping

print(f"Parsed {len(routing)} combinations")

with open('d:\\WorldCupPickems\\src\\data\\thirdPlaceRouting.json', 'w', encoding='utf-8') as f:
    json.dump(routing, f, indent=2)
