import re

with open("service/static/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Let's count divs and find mismatch indices with line numbers
lines = content.splitlines()

stack = [] # contains tuples of (line_num, line_content)
mismatches = []

for line_num, line in enumerate(lines, 1):
    # Find all <div> or </div> in this line (simplified)
    # Match <div ...> or <div>
    divs = re.findall(r"<div(?:\s+[^>]*?)?>|</div>", line, re.IGNORECASE)
    for d in divs:
        if d.startswith("</"):
            if not stack:
                mismatches.append(f"Line {line_num}: Unexpected closing </div>: {line.strip()}")
            else:
                stack.pop()
        else:
            stack.append((line_num, line.strip()))

print(f"Stack size at end: {len(stack)}")
if stack:
    print("Unclosed divs remaining on stack:")
    for num, txt in stack:
        print(f"  Line {num}: {txt[:80]}")
if mismatches:
    print("Mismatched closing divs:")
    for m in mismatches:
        print(" ", m)
