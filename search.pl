#!C:/xampp/perl/bin/perl.exe
use strict;
use warnings;
use CGI;

my $cgi = CGI->new;
my $q = $cgi->param('q') || '';

# Carga de CPU sin usar mucha RAM
my $dummy = 0;
for (1..20000000) {
    $dummy += sqrt($_) * rand();
}

print $cgi->header('text/html; charset=UTF-8');

# Simulación de resultados (puedes cambiar los links)
my @results = (
    { url => "http://example.com/page1.html", score => 19.62 },
    { url => "http://example.com/page2.html", score => 13.36 },
    { url => "http://example.com/page3.html", score => 0.95 },
    { url => "http://example.com/page4.html", score => 0.47 },
    { url => "http://example.com/page5.html", score => 0.08 },
);

print "<html><head><title>Results</title></head><body>";
print "<h1>Results of: $q</h1>";

foreach my $r (@results) {
    print qq{<p><a href="$r->{url}">$r->{url}</a> $r->{score}</p>};
}

print "</body></html>";