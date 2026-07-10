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
import { fonts } from '../../styles/typography';

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
              textStyle={styles.loginBtnText}
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

  header: { alignItems: 'center', paddingTop: spacing['2xl'], paddingBottom: spacing.xl },
  // Logo reduzido: era fontSize 42 / letterSpacing 6 — proporção grande demais para o header.
  logo: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.textPrimary, letterSpacing: 1.5 },
  logoAccent: { color: colors.accent },
  logoLine: { width: 36, height: 2, backgroundColor: colors.primary, marginVertical: spacing.sm },
  tagline: { fontSize: 11, fontWeight: '600', color: colors.textMuted, letterSpacing: 2 },

  form: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    padding: spacing.xl,
  },
  formTitle: {
    fontFamily: fonts.displaySemibold,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  loginBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  loginBtnText: {
    fontFamily: fonts.displayBold,
    color: colors.textInverse,
    letterSpacing: 1,
  },
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
    borderRadius: 4,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  registerText: { fontFamily: fonts.displayBold, fontSize: 13, color: colors.textSecondary, letterSpacing: 1 },

  footer: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 },
  footerLink: { color: colors.primary },
});