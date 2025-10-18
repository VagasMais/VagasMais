from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
	raise RuntimeError("MONGO_URI não está definido no arquivo .env")

client = None
try:
	client = MongoClient(MONGO_URI, tls=True, tlsCAFile=certifi.where())
	db = client["VagasPlus"]
	vagas_collection = db["vagas"]
	denuncias_collection = db["denuncias"]

	# Testa conexão com um ping; útil para detectar problemas no startup
	try:
		client.admin.command('ping')
		print('MongoDB: conexão estabelecida com sucesso')
	except Exception as ping_err:
		# Erro de ping: logamos e re-levantamos para que o serviço falhe e você veja nos logs do Render
		host_info = None
		try:
			# tenta extrair host do URI para dar uma dica (sem revelar credenciais)
			host_info = MONGO_URI.split('@')[-1].split('/')[0]
		except Exception:
			host_info = 'desconhecido'
		print('MongoDB: falha ao executar ping. Host:', host_info)
		print('MongoDB ping error:', repr(ping_err))
		raise
except Exception as conn_err:
	# Mensagem final com dicas para resolver problemas comuns
	print('Erro ao conectar ao MongoDB Atlas:', repr(conn_err))
	print('Verifique:')
	print('- Se a variável MONGO_URI está correta no ambiente do Render')
	print('- Se o MongoDB Atlas permite conexões do IP do Render (Network Access whitelist)')
	print("- Se o bundle CA está acessível (usamos certifi) e se sua versão do Python é compatível com TLS do Atlas")
	# Re-raise para que o processo mostre o traceback nos logs do Render
	raise
