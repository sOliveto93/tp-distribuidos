import json
import time
from kafka import KafkaProducer
from db import obtener_eventos_pendientes, marcar_evento_enviado, marcar_evento_fallido,reactivar_eventos_fallidos

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v, default=str).encode("utf-8")
)
reactivar_eventos_fallidos()

print("Iniciando polling de outbox...")

try:
    while True:
        eventos = obtener_eventos_pendientes()

        for evento in eventos:
            try:
                producer.send("eventos", value=evento).get(timeout=10)

                marcar_evento_enviado(evento["message_id"])

                print(f"Evento enviado: {evento['message_id']}")

            except Exception as error:
                print(f"Error al enviar evento: {error}")
                marcar_evento_fallido(evento["message_id"])
        time.sleep(3)
       
except KeyboardInterrupt:
    print("Productor detenido.")

finally:
    producer.close()