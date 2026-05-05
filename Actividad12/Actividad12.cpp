#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include <chrono>

using namespace std;

struct DictionaryEntry {
    string token;
    int numDocs;
    int start;
};

struct PostingEntry {
    int docId;
    double weight;
};

string toLower(string text) {
    transform(text.begin(), text.end(), text.begin(), ::tolower);
    return text;
}

bool findInDictionary(const string& word, DictionaryEntry& entry, const string& dictionaryFile) {
    ifstream file(dictionaryFile);
    string line;

    while (getline(file, line)) {
        stringstream ss(line);
        int index, numDocs, start;
        string token;

        ss >> index >> token >> numDocs >> start;

        if (token == word) {
            entry.token = token;
            entry.numDocs = numDocs;
            entry.start = start;
            return true;
        }
    }

    return false;
}

vector<PostingEntry> readPostings(int start, int numDocs, const string& postingFile) {
    ifstream file(postingFile);
    string line;
    vector<PostingEntry> results;
    int currentLine = 1;

    while (getline(file, line)) {
        if (currentLine >= start && currentLine < start + numDocs) {
            stringstream ss(line);
            int position, docId;
            double weight;

            ss >> position >> docId >> weight;
            results.push_back({ docId, weight });
        }

        currentLine++;
    }

    return results;
}

string findDocumentName(int docId, const string& documentsFile) {
    ifstream file(documentsFile);
    string line;

    while (getline(file, line)) {
        stringstream ss(line);
        int position, id;
        string fileName;

        ss >> position >> id >> fileName;

        if (id == docId) {
            return fileName;
        }
    }

    return "";
}

void ejecutarBusqueda(string palabra, bool usarStop) {
    palabra = toLower(palabra);

    string dictionaryFile = usarStop ? "diccionario.txt" : "diccionario_sin_stop.txt";
    string postingFile = usarStop ? "posting.txt" : "posting_sin_stop.txt";
    string documentsFile = usarStop ? "documentos.txt" : "documentos_sin_stop.txt";

    cout << "\nComando confirmado: retrieve " << palabra << endl;
    cout << "Version seleccionada: " << (usarStop ? "CON stop list" : "SIN stop list") << endl;
    cout << "Archivos usados:" << endl;
    cout << "- " << dictionaryFile << endl;
    cout << "- " << postingFile << endl;
    cout << "- " << documentsFile << endl;

    DictionaryEntry entry;

    if (!findInDictionary(palabra, entry, dictionaryFile)) {
        cout << "\nNo se encontraron documentos para: " << palabra << endl;
        return;
    }

    vector<PostingEntry> postings = readPostings(entry.start, entry.numDocs, postingFile);

    cout << "\nDocumentos encontrados:\n";

    int counter = 1;

    for (PostingEntry p : postings) {
        string documentName = findDocumentName(p.docId, documentsFile);

        if (!documentName.empty()) {
            cout << counter << ". " << documentName << endl;
            counter++;
        }
    }
}

int main() {
    string comando;
    char opcionStop;
    char repetir;

    do {
        cout << "Ingresa el comando: ";
        getline(cin, comando);

        if (comando.rfind("retrieve ", 0) != 0) {
            cout << "Comando invalido. Debe iniciar con: retrieve palabra" << endl;
            continue;
        }

        string palabra = comando.substr(9);

        cout << "Deseas usar stop list? (s/n): ";
        cin >> opcionStop;
        cin.ignore();

        bool usarStop = (opcionStop == 's' || opcionStop == 'S');

        stringstream ss(palabra);
        string token;

        auto inicio = chrono::high_resolution_clock::now();

        while (ss >> token) {
            ejecutarBusqueda(token, usarStop);
        }

        auto fin = chrono::high_resolution_clock::now();
        chrono::duration<double> duracion = fin - inicio;

        ofstream log("a12_matricula.txt", ios::app);

        log << "Consulta: " << palabra << endl;
        log << "Modo: " << (usarStop ? "CON stop list" : "SIN stop list") << endl;
        log << "Tiempo: " << duracion.count() << " segundos" << endl;
        log << "======================================" << endl;

        log.close();

        cout << "\nDeseas ejecutar otro comando? (s/n): ";
        cin >> repetir;
        cin.ignore();

        cout << endl;

    } while (repetir == 's' || repetir == 'S');

    cout << "Programa finalizado." << endl;

    return 0;
}