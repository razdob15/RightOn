import csv



invalid_rights = []
with open('data.csv', newline='', encoding='utf-8') as csvfile, open('new.csv', 'w', newline='', encoding='utf-8') as newfile:
  reader = csv.DictReader(csvfile)
  fieldnames = reader.fieldnames
  if 'DESCRIPTION' not in fieldnames:
    fieldnames.append('DESCRIPTION')
  writer = csv.DictWriter(newfile, fieldnames=fieldnames)
  writer.writeheader()
  for row in reader:
    print(f"{row['תיאור הזכות']} --- {row['שם הזכות']}"[::-1])
    print("Enter DESCRIPTION (end with an empty line):")
    lines = []
    while True:
      line = input()
      if line == "":
        break
      lines.append(line)
    desc = "\n".join(lines)
    row['DESCRIPTION'] = desc
    writer.writerow(row)
