with open("service/static/index.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines, 1):
    if "function switchTab" in line:
        print(f"switchTab found at line {idx}: {line.strip()}")
        # print next 30 lines
        for j in range(idx, idx + 40):
            print(f"{j}: {lines[j-1].strip()}")
