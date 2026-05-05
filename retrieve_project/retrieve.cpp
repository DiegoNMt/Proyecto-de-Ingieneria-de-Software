#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <set>
#include <algorithm>

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

string toLowerText(string text) {
    transform(text.begin(), text.end(), text.begin(), [](unsigned char c) {
        return tolower(c);
    });
    return text;
}

vector<string> splitQuery(const string& query) {
    vector<string> words;
    stringstream ss(query);
    string word;
    while (ss >> word) {
        words.push_back(toLowerText(word));
    }
    return words;
}

bool findInDictionary(const string& word, DictionaryEntry& entry, const string& dictionaryFile) {
    ifstream file(dictionaryFile);
    if (!file.is_open()) {
        cout << "No se pudo abrir " << dictionaryFile << endl;
        return false;
    }

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;

        stringstream ss(line);
        int index;
        string token;
        int numDocs;
        int start;

        ss >> index >> token >> numDocs >> start;

        if (toLowerText(token) == word) {
            entry.token = token;
            entry.numDocs = numDocs;
            entry.start = start;
            return true;
        }
    }

    return false;
}

vector<PostingEntry> readPostings(int start, int numDocs, const string& postingFile) {
    vector<PostingEntry> results;

    if (start < 1 || numDocs <= 0) return results;

    ifstream file(postingFile);
    if (!file.is_open()) {
        cout << "No se pudo abrir " << postingFile << endl;
        return results;
    }

    string line;
    int currentLine = 1;

    while (getline(file, line)) {
        if (currentLine >= start && currentLine < start + numDocs) {
            stringstream ss(line);
            int position;
            int docId;
            double weight;
            ss >> position >> docId >> weight;
            results.push_back({docId, weight});
        }
        currentLine++;
    }

    return results;
}

string findDocumentName(int docId, const string& documentsFile) {
    ifstream file(documentsFile);
    if (!file.is_open()) {
        cout << "No se pudo abrir " << documentsFile << endl;
        return "";
    }

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;

        stringstream ss(line);
        int position;
        int id;
        string fileName;

        ss >> position >> id >> fileName;

        if (id == docId) {
            return fileName;
        }
    }

    return "";
}

set<int> searchOneToken(const string& token, const string& dictionaryFile, const string& postingFile) {
    set<int> docs;
    DictionaryEntry entry;

    if (!findInDictionary(token, entry, dictionaryFile)) {
        return docs;
    }

    vector<PostingEntry> postings = readPostings(entry.start, entry.numDocs, postingFile);

    for (const PostingEntry& p : postings) {
        docs.insert(p.docId);
    }

    return docs;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "Uso: retrieve palabra" << endl;
        cout << "Ejemplo: retrieve gato" << endl;
        cout << "Ejemplo con varias palabras: retrieve \"United States laws\"" << endl;
        return 1;
    }

    string query = "";
    for (int i = 1; i < argc; i++) {
        query += argv[i];
        if (i < argc - 1) query += " ";
    }

    char option;
    cout << "¿Deseas usar archivos CON stop list? (s/n): ";
    cin >> option;

    bool useStopList = (option == 's' || option == 'S');

    string dictionaryFile = useStopList ? "diccionario.txt" : "diccionario_sin_stop.txt";
    string postingFile = useStopList ? "posting.txt" : "posting_sin_stop.txt";
    string documentsFile = useStopList ? "documentos.txt" : "documentos_sin_stop.txt";

    vector<string> tokens = splitQuery(query);
    set<int> finalDocs;
    bool first = true;

    for (const string& token : tokens) {
        set<int> tokenDocs = searchOneToken(token, dictionaryFile, postingFile);

        if (first) {
            finalDocs = tokenDocs;
            first = false;
        } else {
            set<int> intersection;
            for (int docId : finalDocs) {
                if (tokenDocs.count(docId)) {
                    intersection.insert(docId);
                }
            }
            finalDocs = intersection;
        }
    }

    if (finalDocs.empty()) {
        cout << "No se encontraron documentos." << endl;
        return 0;
    }

    int counter = 1;
    for (int docId : finalDocs) {
        string documentName = findDocumentName(docId, documentsFile);
        if (!documentName.empty()) {
            cout << counter << ". " << documentName << endl;
            counter++;
        }
    }

    return 0;
}
