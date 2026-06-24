import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'E-mail obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'E-mail inválido';
    if (!password) e.password = 'Senha obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.logo}>
              AUTO<Text style={styles.logoAccent}>PARTS</Text>
            </Text>
            <View style={styles.logoLine} />
            <Text style={styles.tagline}>PEÇAS DE ALTA PERFORMANCE</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>ACESSE SUA CONTA</Text>

            <Input
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="seu@email.com"
              error={errors.email}
            />

            <Input
              label="Senha"
              value={password}
              onChangeText={setPassword}
              isPassword
              placeholder="••••••••"
              error={errors.password}
            />

            <Button
              label="Entrar"
              onPress={handleLogin}
              isLoading={isLoading}
              fullWidth
              size="lg"
              style={styles.loginBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.registerText}>
                CRIAR CONTA
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Ao continuar, você concorda com nossos{'\n'}
            <Text style={styles.footerLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.footerLink}>Política de Privacidade</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing['2xl'] },

  header: { alignItems: 'center', paddingTop: spacing['3x1'], paddingBottom: spacing['2xl'] },
  logo: { fontSize: 42, fontWeight: '900', color: colors.textPrimary, letterSpacing: 6 },
  logoAccent: { color: colors.primary },
  logoLine: { width: 60, height: 3, backgroundColor: colors.primary, marginVertical: spacing.md },
  tagline: { fontSize: 11, fontWeight: '600', color: colors.textMuted, letterSpacing: 3 },

  form: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  formTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  loginBtn: { marginTop: spacing.sm },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 11, color: colors.textMuted, fontWeight: '600', letterSpacing: 1 },
  registerBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  registerText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1 },

  footer: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 },
  footerLink: { color: colors.primary },
});