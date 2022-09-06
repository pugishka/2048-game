import sqlite3

from flask import Flask, render_template, request, url_for, flash, redirect, jsonify, json
import pymysql.cursors, subprocess

app = Flask(__name__,  root_path = "../IFT3225_TP3")
app.config['SECRET_KEY'] = '_5#y2LF4Q8z'


def get_db_connection(type):

    # Sans connection MySQL (db local)
    #conn = sqlite3.connect('../IFT3225_TP3/joueurs.db')
    #conn.row_factory = sqlite3.Row

    # Connection MySQL
    connection = pymysql.connect(
        host='www-ens.iro.umontreal.ca',
        user='charonon',
        password='nonp119C',
        db='charonon_joueurs',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor)
    conn = connection.cursor()
    if (type == "delete" or type == "edit" or type == "create"):
        conn = connection

    return conn

# Page d'accueil
@app.route('/')
def index():
    return render_template('2048_html.html')

# S'inscrire
@app.route('/inscription', methods=('GET', 'POST'))
def inscription():
    if request.method == 'POST':
        newUser = request.form['usernameNew']
        a = request.form['admin']

        if not newUser:
            flash('Le surnom est obligatoire.')
        else:
            conn = get_db_connection("")
            conn.execute('SELECT username FROM Joueurs')
            usernames = conn.fetchall()
            j = 0
            for i in usernames:
                if i['username'] == newUser:
                    j = 1
                    break

            if (j == 1):
                flash('Ce surnom est deja pris.')
                conn.close()
                return render_template('inscription.html')
            else:
                conn.close()
                conn = get_db_connection("create")
                conn.cursor().execute('INSERT INTO Joueurs (username, administrateur) VALUES ("'+ str(newUser) +'", '+ str(a) +');')
                conn.commit()
                conn.close()
                return redirect('../app.cgi')
    return render_template('inscription.html')
    
# Se connecter
@app.route('/login', methods=('GET', 'POST'))
def login():	

    if request.method == 'POST':
        user = request.form['username']
        if not user:
            flash('Le surnom est obligatoire.')
            return render_template('login.html')
        else:
            conn = get_db_connection("")
            if (conn):
                conn.execute("SELECT id, username, score, administrateur FROM Joueurs")
                usernames = conn.fetchall()
                j = 0
                id = 0
                for i in usernames:
                    if i['username'] == user:
                        j = 1
                        id = str(i['id'])
                        admin = str(i['administrateur'])
                        break
                if (j==0):
                    flash('Ce joueur n\'existe pas.')
                    conn.close()
                    return render_template('login.html')
                else:
                    conn.close()
                    conn = get_db_connection("edit")
                    conn.cursor().execute('UPDATE Joueurs SET connected = TRUE WHERE id = ' + id + ';')
                    conn.commit()
                    conn.close()
                    userId = '{"id": "' + id + '", "admin" : "' + admin + '"}'

                    return redirect(url_for('jeu', userId=userId))
            else:
                flash('Pas de connexion.')
                return render_template('login.html')

    return render_template('login.html')

# Se déconnecter
@app.route("/jeu/deconnexion/<info>", methods=["POST"])
def deconnexion(info):
    conn = get_db_connection("edit")
    info = json.loads(info)
    id = str(info["id"])
    conn.cursor().execute('UPDATE Joueurs SET connected = FALSE WHERE id = ' + id + ';')
    conn.commit()
    conn.close()
    return ("1")


# Avoir le meilleur score
@app.route("/jeu/getScore", methods=["POST"])
def getScore():
    conn = get_db_connection("")
    conn.execute('SELECT MIN(score) as bestscore FROM Joueurs WHERE score > 0;')
    score = conn.fetchall()
    score = score[0]
    conn.close()
    score = score["bestscore"]
    r = '{"score" : "'+ str(score) +'"}'
    return r

# source :
# https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853

# Avoir les infos des joueurs
@app.route("/jeu/getInfoJoueurs", methods=["POST"])
def getInfoJoueurs():
    conn = get_db_connection("")
    conn.execute('SELECT * FROM Joueurs;')
    joueurs = conn.fetchall()
    conn.close()
    j = '['
    for row in joueurs:
        r = '{"id" : "'+ str(row["id"]) +'", "username" : "'+ str(row["username"]) +'", "created" : "'+ str(row["created"]) +'", "score" : "'+ str(row["score"]) +'", "administrateur" : "'+ str(row["administrateur"]) + '", "connected" : "'+ str(row["connected"]) +'"},'
        j += r
    j = j[:len(j)-1] + "]"
    return j


# Mettre à jour le meilleur score
@app.route("/jeu/updateScore/<info>", methods=["POST"])
def updateScore(info):
    conn = get_db_connection("")
    info = json.loads(info)
    id = str(info["id"])
    score = str(info["score"])
    conn.execute('SELECT score FROM Joueurs WHERE id= ' + id + ';')
    previousScore = conn.fetchall()
    conn.close()
    if ( (int(previousScore[0]["score"]) > int(score)) or (int(previousScore[0]["score"]) == 0)):
        conn = get_db_connection("edit")
        conn.cursor().execute('UPDATE Joueurs SET score = ' + score + ' WHERE id = ' + id + ';')
        conn.commit()
        conn.close()
        return ("1")
    return ("0")

# Page du jeu
@app.route('/jeu/<userId>', methods=('GET', 'POST'))
def jeu(userId):
    userId = json.loads(userId)
    id = str(userId["id"])
    admin = str(userId["admin"])
    return render_template('jeu_joueur.html', id=id, admin=admin)
