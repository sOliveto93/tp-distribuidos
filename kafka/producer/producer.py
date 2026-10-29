import json, time
from kafka import KafkaProducer
producer = KafkaProducer( bootstrap_servers="localhost:9092", 
                         value_serializer=lambda v: json.dumps(v, ensure_ascii=False).encode('utf-8'))


print("Iniciando Productor de prueba... Presioná Ctrl+C para detener.")

contador = 1
try:
    while True:
        mensaje = {"estado": "OK", "mensaje": f"Prueba de conexión n° {contador}"}
        producer.send('topic_prueba', value=mensaje)
        producer.flush()
        
        print(f"Enviado: {mensaje}")
        contador += 1
        time.sleep(3)
except KeyboardInterrupt:
    print("\nProductor detenido.")