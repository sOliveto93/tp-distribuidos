import mysql.connector

def obtener_eventos_pendientes():
    conexion = mysql.connector.connect(
        host="localhost",
        port=3307,
        user="root",
        password="root",
        database="museo"
    )

    cursor = conexion.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM outbox_eventos
        WHERE estado = 'PENDIENTE'
    """)

    eventos = cursor.fetchall()

    cursor.close()
    conexion.close()

    return eventos



def marcar_evento_enviado(message_id):
    conexion = mysql.connector.connect(
        host="localhost",
        port=3307,
        user="root",
        password="root",
        database="museo"
    )

    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE outbox_eventos
        SET estado = 'ENVIADO',
            enviado_en = NOW()
        WHERE message_id = %s
    """, (message_id,))

    conexion.commit()
    cursor.close()
    conexion.close()