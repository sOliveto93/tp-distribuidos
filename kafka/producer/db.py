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
        UPDATE outbox_eventos
        SET estado = 'PENDIENTE',
            intentos = 0
        WHERE estado = 'FALLIDO' 
          AND disponible_en <= NOW()
    """)
    conexion.commit()

    cursor.execute("""
        SELECT *
        FROM outbox_eventos
        WHERE estado = 'PENDIENTE'
          AND (disponible_en IS NULL OR disponible_en <= NOW())
        ORDER BY id ASC
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

def marcar_evento_fallido(message_id, max_intentos=3):
    conexion = mysql.connector.connect(
        host="localhost", port=3307, user="root", password="root", database="museo"
    )

    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE outbox_eventos 
        SET intentos = COALESCE(intentos, 0) + 1,
            disponible_en = DATE_ADD(NOW(), INTERVAL 10 SECOND)
        WHERE message_id = %s
    """, (message_id,))

    cursor.execute("""
        UPDATE outbox_eventos 
        SET estado = 'FALLIDO',
            disponible_en = DATE_ADD(NOW(), INTERVAL 1 MINUTE)
        WHERE message_id = %s AND intentos >= %s
    """, (message_id, max_intentos))

    conexion.commit()

    cursor.close()

    conexion.close()

def reactivar_eventos_fallidos():
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
        SET estado = 'PENDIENTE',
            intentos = 0,
            disponible_en = NOW()
        WHERE estado = 'FALLIDO'
    """)

    filas = cursor.rowcount
    conexion.commit()
    cursor.close()
    conexion.close()

    if filas > 0:
        print(f"Se reactivaron {filas} evento(s) fallidos a PENDIENTE.")