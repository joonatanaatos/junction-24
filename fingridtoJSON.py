import pandas as pd


def toJSON(file: str):

    # Load the Excel file (use the specific sheet name if needed)

    df = pd.read_excel(
        file, sheet_name="Kehitysehdotukset"
    )  # Replace "Sheet1" with your sheet name if necessary

    # Convert the DataFrame to JSON
    json_data = df.to_json(
        orient="records"
    )  # 'records' format outputs a list of dictionaries

    # Save to a JSON file
    with open("parsed_excel.json", "w") as json_file:
        json_file.write(json_data)


if __name__ == "__main__":
    excel_file = "data.xlsx"
    toJSON(excel_file)
