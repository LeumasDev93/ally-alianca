"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MailOpen, MessageSquare } from "lucide-react";
interface Message {
  text: string;
  isUser: boolean;
}

interface ChatProps {
  onClose?: () => void;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  messages?: Message[]; // Mensagens específicas desta conversa
}

interface Topic {
  id: string;
  title: string;
  response: string;
  followUpTopics?: string[]; // IDs dos próximos tópicos a mostrar
}

export default function Chat({ onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'messages' | 'home'>('home');
  const [showAllConversations, setShowAllConversations] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const [currentTopicIds, setCurrentTopicIds] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7']);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  // Todos os tópicos disponíveis
  const allTopics: Record<string, Topic> = {
    // Tópicos principais
    '1': {
      id: '1',
      title: 'Produtos e Seguros',
      response: 'Oferecemos diversos produtos:\n• 🚗 Seguro Automóvel\n• ✈️ Assistência em Viagem\n• 👷 Acidentes de Trabalho\n• 📋 Caução\n\nSelecione um produto para saber mais:',
      followUpTopics: ['1a', '1b', '1c', '1d', 'voltar']
    },
    '1a': {
      id: '1a',
      title: '🚗 Seguro Automóvel',
      response: 'O Seguro Automóvel protege você e seu veículo com:\n• Responsabilidade Civil\n• Danos próprios\n• Roubo e incêndio\n• Assistência 24h\n\nPreços competitivos! Gostaria de fazer uma simulação?',
      followUpTopics: ['3', '2', 'voltar']
    },
    '1b': {
      id: '1b',
      title: '✈️ Assistência em Viagem',
      response: 'Viaje com confiança! Cobertura completa:\n• Assistência médica\n• Bagagem extraviada\n• Cancelamento de viagem\n• Suporte 24/7\n\nEstamos sempre consigo!',
      followUpTopics: ['3', '2', 'voltar']
    },
    '1c': {
      id: '1c',
      title: '👷 Acidentes de Trabalho',
      response: 'Proteja seus colaboradores:\n• Cobertura completa\n• Assistência imediata\n• Processos simplificados\n\nSegurança para sua empresa!',
      followUpTopics: ['3', '2', 'voltar']
    },
    '1d': {
      id: '1d',
      title: '📋 Caução',
      response: 'Seguro Caução para garantir seus contratos:\n• Execução de obras\n• Fornecimento de bens\n• Prestação de serviços\n\nSoluções personalizadas!',
      followUpTopics: ['3', '2', 'voltar']
    },
    '2': {
      id: '2',
      title: 'Agendar Atendimento',
      response: 'Ótimo! Para agendar:\n📞 (+238) 350 38 60\n📱 WhatsApp: (+238) 972 13 63\n📧 alianca@aliancaseguros.cv\n\nPreferência de horário?',
      followUpTopics: ['4', '5', 'voltar']
    },
    '3': {
      id: '3',
      title: 'Fazer Simulação',
      response: 'Para simulação:\n💻 Site: alianca-web.vercel.app\n📞 Telefone: (+238) 350 38 60\n📧 Email: alianca@aliancaseguros.cv\n\nQual produto deseja simular?',
      followUpTopics: ['1', '2', 'voltar']
    },
    '4': {
      id: '4',
      title: 'Horário de Funcionamento',
      response: 'Nosso horário:\n⏰ Segunda a sexta: 8h às 17h\n⏰ Sábado: 8h às 12h\n\nGostaria de agendar?',
      followUpTopics: ['2', '5', 'voltar']
    },
    '5': {
      id: '5',
      title: 'Localização e Contatos',
      response: 'Entre em contato:\n📞 (+238) 350 38 60\n📱 (+238) 972 13 63\n📧 alianca@aliancaseguros.cv\n📍 Achada Santo António, AV. OUA',
      followUpTopics: ['4', '2', 'voltar']
    },
    '6': {
      id: '6',
      title: 'Assistência em Viagem',
      response: 'Assistência em Viagem completa:\n• Cobertura médica internacional\n• Proteção de bagagem\n• Cancelamento de viagem\n• Suporte 24/7\n\nViaje tranquilo!',
      followUpTopics: ['3', '2', 'voltar']
    },
    '7': {
      id: '7',
      title: 'Sinistros e Reclamações',
      response: 'Reportar sinistro:\n📞 Linha Direta: (+238) 350 38 60\n📧 alianca@aliancaseguros.cv\n\nEstamos prontos para ajudar!',
      followUpTopics: ['5', '2', 'voltar']
    },
    'voltar': {
      id: 'voltar',
      title: '↩️ Voltar ao Menu Principal',
      response: '',
      followUpTopics: ['1', '2', '3', '4', '5', '6', '7']
    }
  };
  
  // Histórico de conversas - carrega do localStorage
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ally_conversations');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Salvar conversas no localStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ally_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Recarregar histórico do localStorage a cada 10 segundos
  useEffect(() => {
    const reloadConversations = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ally_conversations');
        if (saved) {
          const loadedConversations = JSON.parse(saved);
          setConversations(loadedConversations);
        }
      }
    };

    // Atualizar a cada 10 segundos
    const interval = setInterval(reloadConversations, 10000);

    return () => clearInterval(interval);
  }, []);

  // Salvar conversa atual quando há mudanças nas mensagens
  useEffect(() => {
    if (currentConversationId && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const conversationTitle = messages.find(m => m.isUser)?.text || 'Nova Conversa';
      
      setConversations(prev => {
        const existing = prev.find(c => c.id === currentConversationId);
        if (existing) {
          // Atualizar conversa existente
          return prev.map(c => 
            c.id === currentConversationId 
              ? { ...c, messages, lastMessage: lastMessage.text, timestamp: 'Agora' }
              : c
          );
        } else {
          // Criar nova conversa
          return [{
            id: currentConversationId,
            title: conversationTitle.substring(0, 30),
            lastMessage: lastMessage.text.substring(0, 50),
            timestamp: 'Agora',
            messages: messages
          }, ...prev];
        }
      });
    }
  }, [messages, currentConversationId]);

  const handleNewConversation = () => {
    setActiveMenu('messages');
    const newId = `conv_${Date.now()}`;
    setCurrentConversationId(newId);
    setMessages([{ text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false }]);
    setCurrentTopicIds(['1', '2', '3', '4', '5', '6', '7']);
    setShowTopics(true);
  };

  const handleOpenConversation = (conversation: Conversation) => {
    setActiveMenu('messages');
    setCurrentConversationId(conversation.id);
    if (conversation.messages) {
      setMessages(conversation.messages);
    } else {
      setMessages([{ text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false }]);
    }
    // Mostrar tópicos após abrir conversa
    setCurrentTopicIds(['1', '2', '3', '4', '5', '6', '7']);
    setShowTopics(true);
  };

  useEffect(() => {
    // Alternar entre imagem e título a cada 3 segundos
    const interval = setInterval(() => {
      setShowImage(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTopicClick = (topicId: string) => {
    const topic = allTopics[topicId];
    if (!topic) return;
    
    // Se for voltar, apenas atualiza os tópicos sem adicionar mensagens
    if (topicId === 'voltar') {
      setShowTopics(false);
      setTimeout(() => {
        setCurrentTopicIds(['1', '2', '3', '4', '5', '6', '7']);
        setShowTopics(true);
      }, 300);
      return;
    }
    
    // Adicionar pergunta do usuário
    setMessages(prev => [...prev, { text: topic.title, isUser: true }]);
    
    // Esconder tópicos após clicar
    setShowTopics(false);
    
    // Resposta do bot
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: topic.response, 
        isUser: false 
      }]);
      
      // Atualizar tópicos para os próximos (follow-up) e mostrar
      setTimeout(() => {
        if (topic.followUpTopics) {
          setCurrentTopicIds(topic.followUpTopics);
        }
        setShowTopics(true);
      }, 500);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      const userMessage = inputMessage.toLowerCase();
      setInputMessage("");
      setShowTopics(false);
      
      // Sistema de respostas baseado em palavras-chave
      setTimeout(() => {
        let botResponse = "";
        
        // Sobre a empresa
        if (userMessage.includes("quem") || userMessage.includes("empresa") || userMessage.includes("aliança")) {
          botResponse = "A Aliança Seguros é uma empresa inovadora no mercado segurador de Cabo Verde, inaugurada em 28 de março. Nossa missão é transformar o setor com inovação, confiança e proximidade. 🏢";
        }
        // Produtos
        else if (userMessage.includes("produto") || userMessage.includes("seguro") || userMessage.includes("serviço")) {
          botResponse = "Oferecemos diversos produtos:\n• 🚗 Seguro Automóvel\n• ✈️ Assistência em Viagem\n• 👷 Acidentes de Trabalho\n• 📋 Caução\n\nQual produto te interessa?";
        }
        // Horário
        else if (userMessage.includes("horário") || userMessage.includes("funcionamento") || userMessage.includes("aberto")) {
          botResponse = "Nosso horário de funcionamento:\n⏰ Segunda a sexta: 8h às 17h\n⏰ Sábado: 8h às 12h\n\nEstamos sempre disponíveis para te atender!";
        }
        // Contato
        else if (userMessage.includes("contato") || userMessage.includes("telefone") || userMessage.includes("ligar") || userMessage.includes("email")) {
          botResponse = "Entre em contato conosco:\n📞 (+238) 350 38 60\n📱 (+238) 972 13 63\n📧 alianca@aliancaseguros.cv\n📍 Achada Santo António, AV. OUA";
        }
        // Resposta padrão
        else {
          botResponse = "Interessante! Posso ajudar com informações sobre nossos produtos, horários, localização ou qualquer dúvida sobre a Aliança Seguros. O que gostaria de saber? 😊";
        }
        
        setMessages(prev => [...prev, { 
          text: botResponse, 
          isUser: false 
        }]);
        
        // Mostrar tópicos novamente
        setTimeout(() => {
          setShowTopics(true);
        }, 500);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-red-950 to-blue-900 xl:p-4">
      <div className={`w-full h-full xl:max-w-4xl xl:max-h-[90vh] xl:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn ${
        activeMenu === 'home' ? 'bg-gradient-to-br from-blue-900 via-red-900 to-blue-900' : 'bg-white dark:bg-gray-800'
      }`}>
        {/* Chat Header */}
        {activeMenu === 'messages' ? (
          // Header para Messages
          <div className="bg-gradient-to-r from-blue-900 to-red-900 p-4 sm:p-5 md:p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              {/* Alterna entre imagens múltiplas em círculo e título */}
              <div className="relative flex items-center gap-4 min-h-[64px]">
              {/* Múltiplas imagens do Ally em círculo - Equipe disponível */}
              <div className={`transition-all duration-700 ease-in-out ${showImage ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                <div className="flex items-center -space-x-2">
                  {/* Imagem Ally */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 z-30">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white shadow-lg">
                      <Image
                        src="/ally.png"
                        alt="Ally"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Ponto verde online */}
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  {/* Letra K */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 z-20">
                    <div className="w-full h-full rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white">K</span>
                    </div>
                    {/* Ponto verde online */}
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  {/* Letra E */}
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 z-10">
                    <div className="w-full h-full rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white">E</span>
                    </div>
                    {/* Ponto verde online */}
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 z-10">
                    <div className="w-full h-full rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white">+5</span>
                    </div>
                    {/* Ponto verde online */}
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>
                
                {/* Título completo com logo */}
                <div className={`transition-all duration-700 ease-in-out flex items-center gap-2 ${!showImage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                    <Image
                      src="/alianca.png"
                      alt="Aliança Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold whitespace-nowrap">Ally</h2>
                </div>
              </div>
              
              {/* Informação da equipe */}
              <div className="flex-1 text-right">
                <p className="text-xs sm:text-sm font-semibold">
                  {showImage ? '8 assistentes online' : 'Estamos aqui para ajudar'}
                </p>
                <p className="text-xs opacity-75 hidden sm:block">
                  {showImage ? 'Resposta em tempo real' : 'Sempre disponível'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Header para Home - Top bar apenas
          <div className="flex flex-col">
            {/* Top bar com logo e ícones */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Image
                    src="/alianca.png"
                    alt="Aliança Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-white font-bold text-lg">ALLY</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Círculos de perfil */}
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-white">
                    <Image
                      src="/ally.png"
                      alt="Assistente 1"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">K</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto ${activeMenu === 'messages' ? 'bg-white dark:bg-gray-800' : ''}`}>
          {activeMenu === 'home' ? (
            // Home - Todo em gradiente
            <div className="flex flex-col h-full">
              {/* Saudação */}
              <div className="px-6 pb-6 pt-8">
                <h1 className="text-white text-4xl sm:text-5xl font-bold mb-2">
                  Olá 👋
                </h1>
                <p className="text-white text-2xl sm:text-3xl font-medium mb-6">
                  Como podemos ajudar?
                </p>
              </div>
              
              {/* Histórico - só mostra se tiver conversas */}
              {conversations.length > 0 && (
                <div className="px-6 pb-4 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-white/90">
                      Conversas Recentes
                    </h3>
                    
                    {/* Botão Ver Menos - em cima quando expandido */}
                    {showAllConversations && conversations.length > 1 && (
                      <button
                        onClick={() => setShowAllConversations(false)}
                        className="text-white/80 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-1 transition-all duration-300"
                      >
                        Ver menos
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Lista de conversas */}
                  <div className="space-y-2">
                    {conversations.slice(0, showAllConversations ? conversations.length : 1).map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleOpenConversation(conversation)}
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                                {conversation.title}
                              </h4>
                              {conversation.unread && (
                                <span className="bg-white text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white/70 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          <span className="text-xs text-white/60 whitespace-nowrap flex-shrink-0">
                            {conversation.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Botão Ver Mais - à direita e em baixo quando recolhido */}
                  {!showAllConversations && conversations.length > 1 && (
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => setShowAllConversations(true)}
                        className="text-white/80 hover:text-white py-2 px-4 text-xs sm:text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:bg-white/10 rounded-lg"
                      >
                        Ver mais ({conversations.length - 1})
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Campo "Envie-nos uma mensagem" - ABAIXO do histórico */}
              <div className="px-6 pb-6 mt-auto">
                <button
                  onClick={handleNewConversation}
                  className="w-full bg-white text-gray-700 px-6 py-4 rounded-xl font-medium text-base sm:text-lg flex items-center justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Envie-nos uma mensagem</span>
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            // Messages - Chat
            <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slideIn`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-800 to-red-800 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Botões de Tópicos */}
              {showTopics && (
                <div className="space-y-2 mt-4 animate-fadeIn">
                  {currentTopicIds.map((topicId) => {
                    const topic = allTopics[topicId];
                    if (!topic) return null;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(topic.id)}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl text-left text-sm sm:text-base font-medium hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        {topic.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Menu */}
        <div className={`border-t ${activeMenu === 'home' ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'} ${activeMenu === 'messages' ? 'bg-white dark:bg-gray-800' : ''}`}>
          <div className="flex items-center justify-around p-3 sm:p-4">
            {/* Home Menu */}
            <button
              onClick={() => {
                setActiveMenu('home');
                setShowAllConversations(false);
              }}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 ${
                activeMenu === 'home'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${activeMenu === 'home' && 'text-white'}`}
            >
              <MailOpen  strokeWidth={3}/>
              <span className="text-xs sm:text-sm font-medium">Inicio</span>
            </button>

            {/* Messages Menu */}
            <button
              onClick={() => setActiveMenu('messages')}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all duration-300 ${
                activeMenu === 'messages'
                  ? 'bg-gradient-to-r from-blue-800 to-red-800 text-white shadow-lg'
                  : activeMenu === 'home'
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <MessageSquare strokeWidth={3}/>
              <span className="text-xs sm:text-sm font-medium">Mensagens</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

