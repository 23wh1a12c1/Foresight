
from io import BytesIO

import pandas as pd

from reportlab.platypus import (

    SimpleDocTemplate,

    Table,

    Paragraph,

    Spacer

)

from reportlab.lib.styles import getSampleStyleSheet

# ============================================================
# PDF EXPORT
# ============================================================

def export_pdf(df, title):

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    elements = []

    # ========================================================
    # TITLE
    # ========================================================

    elements.append(

        Paragraph(

            title,

            styles['Title']

        )

    )

    elements.append(

        Spacer(1, 12)

    )

    # ========================================================
    # TABLE
    # ========================================================

    data = [

        df.columns.tolist()

    ] + df.values.tolist()

    table = Table(data)

    elements.append(table)

    # ========================================================
    # BUILD PDF
    # ========================================================

    doc.build(elements)

    pdf = buffer.getvalue()

    buffer.close()

    return pdf
