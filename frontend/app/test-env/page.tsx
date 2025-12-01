'use client'

export default function TestEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test des Variables d'Environnement</h1>
        
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">NEXT_PUBLIC_SUPABASE_URL</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Valeur:</p>
              <code className="block p-3 bg-muted rounded break-all">
                {supabaseUrl || '❌ Non définie'}
              </code>
              <p className="text-sm">
                {supabaseUrl ? (
                  supabaseUrl.includes('placeholder') ? (
                    <span className="text-yellow-600">⚠️ Placeholder détecté</span>
                  ) : (
                    <span className="text-green-600">✅ URL valide</span>
                  )
                ) : (
                  <span className="text-red-600">❌ Variable non chargée</span>
                )}
              </p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">NEXT_PUBLIC_SUPABASE_ANON_KEY</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Valeur (premiers 50 caractères):</p>
              <code className="block p-3 bg-muted rounded break-all">
                {supabaseKey ? `${supabaseKey.substring(0, 50)}...` : '❌ Non définie'}
              </code>
              <p className="text-sm">
                {supabaseKey ? (
                  supabaseKey.includes('REMPLACEZ') || supabaseKey.includes('placeholder') ? (
                    <span className="text-yellow-600">⚠️ Placeholder détecté</span>
                  ) : supabaseKey.startsWith('eyJ') ? (
                    <span className="text-green-600">✅ Clé valide (commence par eyJ)</span>
                  ) : (
                    <span className="text-yellow-600">⚠️ Format non standard</span>
                  )
                ) : (
                  <span className="text-red-600">❌ Variable non chargée</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Longueur: {supabaseKey?.length || 0} caractères
              </p>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-muted/50">
            <h2 className="text-xl font-semibold mb-4">Diagnostic</h2>
            <ul className="space-y-2">
              <li>
                {supabaseUrl && !supabaseUrl.includes('placeholder') ? (
                  <span className="text-green-600">✅ URL Supabase configurée</span>
                ) : (
                  <span className="text-red-600">❌ URL Supabase manquante ou placeholder</span>
                )}
              </li>
              <li>
                {supabaseKey && !supabaseKey.includes('REMPLACEZ') && !supabaseKey.includes('placeholder') ? (
                  <span className="text-green-600">✅ Clé Supabase configurée</span>
                ) : (
                  <span className="text-red-600">❌ Clé Supabase manquante ou placeholder</span>
                )}
              </li>
              <li>
                {supabaseKey && supabaseKey.length > 100 ? (
                  <span className="text-green-600">✅ Longueur de clé correcte</span>
                ) : (
                  <span className="text-yellow-600">⚠️ Clé trop courte (devrait être 200+ caractères)</span>
                )}
              </li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950">
            <h2 className="text-xl font-semibold mb-4">💡 Solutions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Vérifiez que le fichier <code>.env.local</code> est dans le dossier <code>frontend/</code></li>
              <li>Vérifiez qu'il n'y a pas d'espaces autour du <code>=</code></li>
              <li>Vérifiez qu'il n'y a pas de guillemets autour des valeurs</li>
              <li><strong>Redémarrez le serveur</strong> après modification (Ctrl+C puis npm run dev)</li>
              <li>Les variables <code>NEXT_PUBLIC_*</code> sont chargées au build, un redémarrage est nécessaire</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

