# Achadinhos Pet - Diretrizes & Memória do Projeto

## Infraestrutura & Deploy em Produção
- **Domínio Principal**: `https://achadinhospet.net`
- **Hospedagem & CI/CD**: Hospedado na **Vercel** com deploy contínuo.
- **Controle de Versão**: Sincronizado e integrado diretamente com o **GitHub** pelo AI Studio.
- **Banco de Dados em Nuvem**: Sincronizado com o **Supabase** (tabela `public.products` e credenciais ativas).
- **Sitemap XML**: `https://achadinhospet.net/sitemap.xml`
- **Robots.txt**: `https://achadinhospet.net/robots.txt`
- **E-mail do Administrador**: `clikdica@gmail.com`

## Regras de SEO & URLs
- Todas as URLs canônicas, OpenGraph, JSON-LD Schema.org, sitemaps e links do Search Console devem apontar para `https://achadinhospet.net`.
- Manter suporte tanto aos arquivos estáticos em `/public/` quanto às rotas dinâmicas em `server.ts` para compatibilidade com a Vercel e o dev server.

## Proposta de Valor & Modelo de Negócio (Afiliados)
- **Missão & Proposta**: Vitrine curada de achadinhos pet para quem não tem tempo de pesquisar o melhor produto, menor preço e entrega rápida. O site faz o rastreamento, curadoria e validação de ofertas.
- **Objetivo Principal de Conversão**: Maximizar cliques qualificados nos links de afiliado (CTR). Vender o produto em destaque é o foco primário, mas o clique do usuário ativa a janela de cookies de afiliado (Shopee/Amazon/Mercado Livre/etc.), gerando comissão mesmo se ele comprar outros itens na loja de destino.
- **Estratégia de UX/Conversão**: Gatilhos visuais claros de urgência/desconto, badges de frete grátis e entrega rápida, botões de ação ("Ir para a Loja Oficial / Pegar Oferta") com alto contraste e sem atrito.

## Integração de Dados & Resiliência
- Catálogo de produtos sincronizado com Supabase na tabela `public.products`.
- Suporte resiliente a fallback local no navegador caso as chaves estejam sendo configuradas.
- Manter o `vercel.json` e as rotas de build compatíveis com o pipeline da Vercel.
