from mcp.server.fastmcp import FastMCP
import os
import csv


# Create an MCP server
mcp = FastMCP("Rights Manager", "1.0.0")

RIGHTS_FILE = os.path.join(os.path.dirname(__file__), "rights.csv")
# RIGHTS_HEADER = ['קטגוריה','שם הזכות','תיאור הזכות','מקור','מעניק הזכות','איש קשר','זכאות','תנאים','חוקה','משוואה','תהליך מימוש','מידע נוסף','תנאים במבנה חדש']
RIGHTS_HEADER = ['תחום', 'שם הזכות', 'תיאור הזכות', 'מקור', 'קישור', 'תנאים']

def ensure_file():
    if not os.path.exists(RIGHTS_FILE):
        with open(RIGHTS_FILE, 'w', encoding='utf-8') as f:
            f.write(','.join(RIGHTS_HEADER) + '\n')


@mcp.tool()
def add_right(right_subject:str, right_name:str, right_description:str, right_source:str, right_link:str, conditions: list[str]) -> str:
    """
    Adds a new right to the rights file.
    
    @param right_subject: The subject of the right (e.g. 'דיור', 'חינוך', ,'כלכלה').
    @param right_name: The name of the right.
    @param right_description: A description of the right.
    @param right_source: The source of the right (the name of the website where the right was found).
    @param right_link: A link to the right.
    @param conditions: A list of conditions for the right. For example, ['age greater than 20', 'Birth country is Ethiopia', 'has a house, rent a house', 'must be distinguished lone soldier']. The logic operator between the conditions is 'and', meaning that all conditions must be met to be eligible for the right. if there are 'or' conditions, they should be separated by a comma.

    @return: whether the right was added successfully.
    """
    ensure_file()     
    
    with open(RIGHTS_FILE, 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([right_subject, right_name, right_description, right_source, right_link, conditions])
    
    return "right added successfully"

@mcp.resource("rights://all")
def get_rights() -> list[dict]:
    """
    Returns a list of all rights in the rights file.

    @return: A list of dictionaries, each representing a right.
    """
    ensure_file()

    rights = []
    with open(RIGHTS_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, fieldnames=RIGHTS_HEADER)
        for row in reader:
            rights.append(row)

    return rights

@mcp.resource("rights://{category}")
def get_rights_by_category(category: str) -> list[dict]:
    """
    Returns a list of rights in a specific category.

    @param category: The category of the rights (e.g. 'דיור', 'חינוך', ,'כלכלה').
    @return: A list of dictionaries, each representing a right in the specified category.
    """
    ensure_file()

    rights = []
    with open(RIGHTS_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, fieldnames=RIGHTS_HEADER)
        for row in reader:
            if row['תחום'] == category:
                rights.append(row)

    return rights