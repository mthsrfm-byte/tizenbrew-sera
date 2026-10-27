<p align="center">
  <img width="160" src="assets/serafimflix-icon.png" alt="Ícone do SerafimFlix+">
</p>

# SerafimFlix+

**Liga a TV, escolhe entre Seraflix e YouTube, e pronto.** 📺

O SerafimFlix+ é um remix do [TizenBrew](https://github.com/reisxd/TizenBrew), o app que deixa
instalar outros apps nas TVs Samsung (Tizen) sem precisar do Tizen Studio toda vez. Eu peguei o
TizenBrew, troquei a roupa e deixei ele com uma cara só, a mesma do
[Seraflix](https://github.com/mthsrfm-byte/stremio-sera):

- **Dois botões que importam.** A tela inicial é feita para abrir o **Seraflix** (filmes e
  séries, uma releitura do Stremio) e o **YouTube** sem propaganda no meio
  ([TizenTube](https://github.com/reisxd/TizenTube)). Os dois já vêm instalados.
- **Tudo em português**, com textos que conversam com você em vez de parecer manual de instrução.
- **Identidade do Seraflix:** as mesmas cores, fontes e o logo SERA, do ícone na barra da Samsung
  até a tela de carregamento.
- **Adicionar apps do GitHub sem sofrimento.** O meu usuário já vem preenchido. Para instalar um app
  novo do meu repositório, basta digitar o nome dele (e a pasta, se tiver). Dá para trocar o
  usuário e instalar de qualquer outra pessoa.
- **Sempre atualizado.** O Seraflix e o YouTube se atualizam sozinhos, e este repositório puxa
  todo dia as novidades do TizenBrew oficial.

> **Não oficial.** Sem ligação com a Samsung, o YouTube, o Stremio ou o projeto TizenBrew.
> Os logos do YouTube e de outros serviços pertencem aos seus donos.

## Instalando

Você precisa de uma TV Samsung com Tizen 3.0 ou mais novo (2017 em diante) e de um Mac na
mesma rede Wi-Fi.

1. Baixe o **[instalador para Mac](https://github.com/mthsrfm-byte/tizenbrew-sera/releases/latest/download/Instalar-SerafimFlix-Mac.zip)**
   e dê dois cliques para descompactar.
2. Clique com o botão direito em `Instalar SerafimFlix+.command` → **Abrir**.
3. Vá respondendo. Ele baixa a versão mais nova, acha a TV na rede, confere o Modo
   Desenvolvedor e instala.

O Mac bloqueou? Cole isto no Terminal, que dá no mesmo:

```
curl -fsSL "https://raw.githubusercontent.com/mthsrfm-byte/tizenbrew-sera/main/instalar/Instalar%20SerafimFlix%2B.command" | bash
```

Se a TV tiver o TizenBrew oficial, o SerafimFlix+ entra no lugar dele e a lista de apps continua lá.

## Fontes do remix

Nada disso existiria sem quem abriu o código antes. Valeu! 💙

- [TizenBrew](https://github.com/reisxd/TizenBrew), de reisxd: a base deste app inteiro.
- [TizenBrew Installer](https://github.com/reisxd/TizenBrewInstaller), de reisxd: a referência
  para o instalador.
- [TizenTube](https://github.com/reisxd/TizenTube), de reisxd: o YouTube sem anúncios.
- [Seraflix](https://github.com/mthsrfm-byte/stremio-sera): o meu remix do Stremio, que é
  remix do [Stremio Kai](https://github.com/allecsc/Stremio-Kai) e do
  [Stremio Kai Timeworn](https://github.com/creachec/Stremio-Kai-Timeworn).

O README original do TizenBrew continua [aqui](../README.md), com a parte técnica.

## Licença

[GPL-3.0](../LICENSE), a mesma do TizenBrew.
