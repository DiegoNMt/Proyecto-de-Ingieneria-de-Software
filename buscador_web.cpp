#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <chrono>
#include <cstdlib> // Para getenv()

using namespace std;

// Función para limpiar y pasar a minúsculas
string toLowerCase(string str) {
    transform(str.begin(), str.end(), str.begin(), ::tolower);
    return str;
}

// Función para decodificar la URL (cambiar los '+' por espacios, etc.)
string urlDecode(string str) {
    string ret;
    char ch;
    int i, ii;
    for (i = 0; i < str.length(); i++) {
        if (str[i] == '%') {
            sscanf(str.substr(i + 1, 2).c_str(), "%x", &ii);
            ch = static_cast<char>(ii);
            ret += ch;
            i = i + 2;
        } else if (str[i] == '+') {
            ret += ' ';
        } else {
            ret += str[i];
        }
    }
    return ret;
}

struct Resultado {
    int docID;
    double score;
};

int main() {
    // 1. IMPRIMIR CABECERAS HTTP PARA EL NAVEGADOR (¡CRÍTICO PARA CGI!)
    cout << "Content-type: text/html; charset=UTF-8\n\n";

    // 2. IMPRIMIR EL INICIO DEL HTML
    cout << "<!DOCTYPE html>\n<html>\n<head>\n<title>Resultados de la Búsqueda</title>\n</head>\n<body>\n";
    cout << "<div style='width: 80%; margin: 0 auto;'>\n";
    cout << "<h1 style='color: teal; border-bottom: 2px solid teal;'>Resultados del Motor de Búsqueda</h1>\n";

    // 3. OBTENER LA QUERY DESDE LA URL (CGI)
    char* query_string_ptr = getenv("QUERY_STRING");
    string raw_query = query_string_ptr ? string(query_string_ptr) : "";
    
    string query_param = "";
    size_t pos = raw_query.find("q=");
    if (pos != string::npos) {
        query_param = raw_query.substr(pos + 2);
    }

    // Decodificar la URL (por si buscaron "exploitation hygiene")
    query_param = urlDecode(query_param);

    if (query_param.empty()) {
        cout << "<p>No ingresaste ninguna palabra para buscar.</p>\n</div>\n</body>\n</html>";
        return 0;
    }

    cout << "<h2>Buscando: <i>" << query_param << "</i></h2>\n";

    auto start = chrono::high_resolution_clock::now();

    // 4. SEPARAR LA QUERY EN MULTIPLES TOKENS (Por si buscan más de una palabra)
    vector<string> queries;
    stringstream ss_query(query_param);
    string temp_word;
    while (ss_query >> temp_word) {
        queries.push_back(toLowerCase(temp_word));
    }

    
    string path_dic = "C:/xampp/cgi-bin/output_final_Actividad_11/diccionario.txt";
    string path_post = "C:/xampp/cgi-bin/output_final_Actividad_11/posting.txt";
    string path_doc = "C:/xampp/cgi-bin/output_final_Actividad_11/documentos.txt";

    ifstream dicFile(path_dic);
    ifstream postFile(path_post);
    ifstream docFile(path_doc);

    if (!dicFile || !postFile || !docFile) {
        cout << "<p style='color: red;'>Error interno: No se encontraron los archivos del índice en el servidor.</p>\n";
        cout << "</div></body></html>";
        return 1;
    }

    // 5. CARGAR EL CATÁLOGO DE DOCUMENTOS
    map<int, string> docMap;
    string line;
    while (getline(docFile, line)) {
        stringstream ss(line);
        int id;
        string name;
        ss >> id >> name;
        docMap[id] = name;
    }
    
    map<int, double> scores;

    // 6. PROCESAR CADA PALABRA DE LA BÚSQUEDA
    for (string query : queries) {
       

        dicFile.clear();
        dicFile.seekg(0);

        int pointer = -1;
        int df = 0;

        while (getline(dicFile, line)) {
            stringstream ss(line);
            int id;
            string token;
            int p;

            ss >> id >> token >> df >> p;

            if (token == query) {
                pointer = p;
                break;
            }
        }

        if (pointer == -1) continue; // La palabra no está en el diccionario

        // Buscar en el posting usando el puntero
        postFile.clear();
        postFile.seekg(0);

        int current = 0;
        int leidos = 0;

        while (getline(postFile, line)) {
            if (current >= pointer && leidos < df) {
                stringstream ss(line);
                int pos, docID;
                double peso;
                ss >> pos >> docID >> peso;

                scores[docID] += peso;
                leidos++;
            }
            current++;
        }
    }

    // 7. ORDENAR LOS RESULTADOS (RANKING)
    vector<Resultado> resultados;
    for (auto& par : scores) {
        resultados.push_back({par.first, par.second});
    }

    sort(resultados.begin(), resultados.end(), [](Resultado a, Resultado b) {
        return a.score > b.score;
    });

    // 8. IMPRIMIR EL TOP 10 EN FORMATO HTML
    if (resultados.empty()) {
        cout << "<p>No se encontraron documentos que coincidan con tu búsqueda.</p>\n";
    } else {
        cout << "<ol>\n";
        int limite = min(10, (int)resultados.size());
        for (int i = 0; i < limite; i++) {
            // Se asume que los HTMLs originales están en la carpeta C:/xampp/htdocs/files/
            string docName = docMap[resultados[i].docID];
            double docScore = resultados[i].score;
            
            cout << "<li style='margin-bottom: 10px;'>";
            cout << "<a href='http://localhost/" << docName << "' target='_blank'>";
            cout << docName << "</a> ";
            cout << "<span style='color: gray; font-size: 0.9em;'>(Ranking: " << docScore << ")</span>";
            cout << "</li>\n";
        }
        cout << "</ol>\n";
    }

    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double> elapsed = end - start;

    cout << "<hr>\n";
    cout << "<p style='font-size: 0.8em; color: gray;'>Tiempo de consulta: " << elapsed.count() << " segundos.</p>\n";
    
    cout << "</div>\n</body>\n</html>";

    return 0;
}